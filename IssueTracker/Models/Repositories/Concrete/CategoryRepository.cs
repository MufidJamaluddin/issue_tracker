using IssueTracker.Models.Datas;
using IssueTracker.Models.Datas.Schemas;
using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;
using System;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;

namespace IssueTracker.Models.Repositories
{
    public class CategoryRepository : ABaseRepository<CategoryVM>, ICategoryRepository
    {
        public CategoryRepository(IssueTrackerDbContext dbContext) : base(dbContext) { }

        public Expression<Func<Category, CategoryVM>> MapVM()
        {
            return (category) => new CategoryVM
            {
                Id = category.Id,
                Name = category.Name,
            };
        }

        public override IQueryable<CategoryVM> GetModel()
        {
            IQueryable<CategoryVM> model = DbContext.Categories.Select(this.MapVM());

            return model;
        }

        public override IQueryable<CategoryVM> GetSearchedModel(CategoryVM searchedData)
        {
            IQueryable<CategoryVM> model = GetModel();

            model = model.Where(u => u.Id == searchedData.Id);

            return model;
        }

        public override IQueryable<CategoryVM> GetSearchedModel(SearchPaginationRequest<CategoryVM> request)
        {
            IQueryable<CategoryVM> model = GetModel();

            if (!string.IsNullOrEmpty(request?.SearchData?.Id))
            {
                model = model.Where(u => u.Id == request.SearchData.Id);
            }

            if (!string.IsNullOrEmpty(request?.SearchData?.Name))
            {
                model = model.Where(u => u.Name.Contains(request.SearchData.Name));
            }

            return model;
        }

        protected string CreateNewCategoryId(string lastId)
        {
            if (lastId == null)
            {
                return "CS-001";
            }

            string[] ids = lastId.Split('-');

            if (int.TryParse(ids[1], out int id_number))
            {
                id_number += 1;
                ids[1] = id_number.ToString(CultureInfo.InvariantCulture).PadLeft(3, '0');
            }

            string newIds = string.Join('-', ids);

            return newIds;
        }

        public override CommonResponse<CategoryVM> SaveData(CategoryVM data, string transactionId)
        {
            CommonResponse<CategoryVM> response = ValidateParameter(data);

            if (response != null)
            {
                return response;
            }

            string lastId = DbContext.Categories.Select(u => u.Id).OrderByDescending(u => u).FirstOrDefault();

            Category categoryData = new Category
            {
                Id = CreateNewCategoryId(lastId),
                Name = data?.Name,
            };

            DbContext.Add(categoryData);

            CategoryHistory categoryDataHistory = new CategoryHistory();
            categoryDataHistory.FillFromCategory(
                categoryData,
                transactionId,
                1,
                TableTransactionOperation.Insert
            );

            DbContext.Add(categoryDataHistory);

            if (DbContext.SaveChanges() > 0)
            {
                data.Id = categoryData.Id;

                return new CommonResponse<CategoryVM>
                {
                    Status = true,
                    Code = "S",
                    Message = "Retrieve Data is Success!",
                    Data = new CategoryVM[] { data },
                };
            }
            else
            {
                return new CommonResponse<CategoryVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Save Data Failed! Please Contact an Web Administrator!",
                    Data = new CategoryVM[] { data },
                };
            }
        }

        public override CommonResponse<CategoryVM> UpdateData(CategoryVM data, string transactionId)
        {
            CommonResponse<CategoryVM> response = ValidateParameter(data);

            if (response != null)
            {
                return response;
            }

            if (string.IsNullOrEmpty(data?.Id))
            {
                return new CommonResponse<CategoryVM>
                {
                    Status = false,
                    Code = "E-001",
                    Message = "Please fill the ID!",
                    Data = new CategoryVM[] { data },
                };
            }

            IQueryable<Category> lastDataContext = DbContext.Categories.AsQueryable();

            lastDataContext = lastDataContext.Where(u =>
                u.Id.Equals(data.Id)
            );

            Category lastData = lastDataContext.FirstOrDefault();

            if (lastData == null)
            {
                return new CommonResponse<CategoryVM>
                {
                    Status = false,
                    Code = "E-002",
                    Message = string.Format("Data not found for ID {0}, please fill the right ID!", data?.Id),
                    Data = new CategoryVM[] { data },
                };
            }

            if (lastData == null)
            {
                return new CommonResponse<CategoryVM>
                {
                    Status = false,
                    Code = "E-004",
                    Message = "Ubah Data Gagal! Data Tidak Ditemukan!",
                    Data = new CategoryVM[] { data },
                };
            }

            lastData.Name = data.Name;

            //DbContext.Add(lastData); No add in update

            int historySequence = lastData?.CategoryHistories?
                .Select(u => u.Seq)
                .OrderByDescending(u => u)
                .FirstOrDefault() ?? 0;

            CategoryHistory categoryDataHistory = new CategoryHistory();
            categoryDataHistory.FillFromCategory(
                lastData,
                transactionId,
                historySequence + 1,
                TableTransactionOperation.Update
            );

            DbContext.Add(categoryDataHistory);

            if (DbContext.SaveChanges() > 0)
            {
                return new CommonResponse<CategoryVM>
                {
                    Status = true,
                    Code = "S",
                    Message = "Save Data is Success!",
                    Data = new CategoryVM[] { data },
                };
            }
            else
            {
                return new CommonResponse<CategoryVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Update Data Failed! Please Contact an Web Administrator!",
                    Data = new CategoryVM[] { data },
                };
            }
        }

        public override CommonResponse<CategoryVM> DeleteData(CategoryVM data, string transactionId)
        {
            IQueryable<Category> lastDataContext = DbContext.Categories.AsQueryable();

            if (string.IsNullOrEmpty(data?.Id))
            {
                return new CommonResponse<CategoryVM>
                {
                    Status = false,
                    Code = "E-001",
                    Message = "Please fill the ID!",
                    Data = new CategoryVM[] { data },
                };
            }

            lastDataContext = lastDataContext.Where(u =>
                u.Id.Equals(data.Id)
            );

            Category lastData = lastDataContext.FirstOrDefault();

            if (lastData == null)
            {
                return new CommonResponse<CategoryVM>
                {
                    Status = false,
                    Code = "E-002",
                    Message = string.Format("Data not found for ID {0}, please fill the right ID!", data?.Id),
                    Data = new CategoryVM[] { data },
                };
            }

            int historySequence = lastData?.CategoryHistories?
                .Select(u => u.Seq)
                .OrderByDescending(u => u)
                .FirstOrDefault() ?? 0;

            DbContext.Remove(lastData);

            CategoryHistory categoryDataHistory = new CategoryHistory();
            categoryDataHistory.FillFromCategory(
                lastData,
                transactionId,
                historySequence + 1,
                TableTransactionOperation.Delete
            );

            DbContext.Add(categoryDataHistory);

            if (DbContext.SaveChanges() > 0)
            {
                return new CommonResponse<CategoryVM>
                {
                    Status = true,
                    Code = "S",
                    Message = "Delete Data is Success!",
                    Data = new CategoryVM[] { data },
                };
            }
            else
            {
                return new CommonResponse<CategoryVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Delete Data Failed! Please Contact an Web Administrator!",
                    Data = new CategoryVM[] { data },
                };
            }
        }
    }
}
