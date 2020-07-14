using IssueTracker.Helpers;
using IssueTracker.Models.Datas;
using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;
using System;
using System.Collections.Generic;
using System.Linq;

namespace IssueTracker.Models.Repositories
{
    public abstract class ABaseRepository<T> : IBaseRepository<T> where T : BaseVM
    {
        protected IssueTrackerDbContext DbContext { get; set; }

        public ABaseRepository(IssueTrackerDbContext dbContext)
        {
            DbContext = dbContext;
        }

        /**
         *  Mendapatkan Model Query Linq
         **/
        public abstract IQueryable<T> GetModel();

        /**
         *  Mendapatkan Model Pencarian Query Linq
         **/
        public virtual IQueryable<T> GetSearchedModel(T searchedData)
        {
            IQueryable<T> model = GetModel();

            if (searchedData != null)
            {
                IQueryable<T> searchedModel = model
                    .Where(u => u.Equals(searchedData))
                    .Where(u => u.IsDeleted != true);

                return searchedModel;
            }

            return model;
        }

        public virtual IQueryable<T> GetSearchedModel(SearchPaginationRequest<T> request)
        {
            if (request != null)
            {
                return GetSearchedModel(request.SearchData);
            }

            return GetModel();
        }

        /**
         *  Mendapatkan Jumlah Semua Data
         **/
        public int CountAllData()
        {
            int total = GetModel().Count();

            return total;
        }

        /**
         *  Mendapatkan Satu Data
         **/
        public virtual T GetOne(T searchedData)
        {
            IQueryable<T> model = GetSearchedModel(searchedData);

            return model.FirstOrDefault();
        }

        /**
         *  Mendapatkan Semua Data
         **/
        public IEnumerable<T> GetAllData()
        {
            IEnumerable<T> data = GetModel().AsEnumerable();

            return data;
        }

        /**
         *  Order Data
         **/
        public virtual IOrderedQueryable<T> GetOrderedDataModel(SearchPaginationRequest<T> request)
        {
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            IQueryable<T> model = GetSearchedModel(request);

            IOrderedQueryable<T> orderedModel = null;

            if (string.IsNullOrEmpty(request.OrderBy))
            {
                request.OrderBy = "Id";

                orderedModel = model.OrderByPropertyName(
                    request.OrderBy,
                    request.IsOrderByAsc
                );
            }
            else
            {
                orderedModel = model.OrderByJsonPropertyName(
                    request.OrderBy,
                    request.IsOrderByAsc
                );
            }

            return orderedModel;
        }

        /**
         *  Mendapatkan Data Pada Page Tertentu
         **/
        public virtual PaginationResponse<T> GetDataPaginated(SearchPaginationRequest<T> request)
        {
            CommonResponse<T> response = ValidateParameter(request);

            if (response != null)
            {
                return new PaginationResponse<T>
                {
                    Status = response.Status,
                    Code = response.Code,
                    Message = response.Message,
                };
            }

            IOrderedQueryable<T> model = GetOrderedDataModel(request);

            int totalData = model.Count();

            IEnumerable<T> selectedData = model.Skip(request.Offset)
                .Take(request.Size)
                .AsEnumerable();

            double totalPages = Math.Ceiling(
                totalData / ((double)Math.Max(request.Size, 1))
            );

            return new PaginationResponse<T>
            {
                Status = true,
                Code = "S",
                Message = "Retrieve Data is Success!",
                TotalPages = (int)totalPages,
                PageSize = request.Size,
                CurrentPage = request.Page,
                Data = selectedData,
            };
        }

        public abstract CommonResponse<T> SaveData(T data, string transactionId);
        public abstract CommonResponse<T> UpdateData(T data, string transactionId);
        public abstract CommonResponse<T> DeleteData(T data, string transactionId);

        /**
         *  Validasi Parameter Request
         **/
        public virtual CommonResponse<T> ValidateParameter(object request)
        {
            if (request == null)
            {
                return new CommonResponse<T>
                {
                    Status = false,
                    Code = "E-001",
                    Message = "Please fill the request data!",
                };
            }

            List<System.ComponentModel.DataAnnotations.ValidationResult> validationRequest = request.ValidateModelData(true);

            if (validationRequest.Count > 0)
            {
                string message = string.Join(", ", validationRequest.Select(u => u.ErrorMessage).ToArray());

                return new CommonResponse<T>
                {
                    Status = false,
                    Code = "E-002",
                    Message = message,
                };
            }

            return null;
        }
    }
}
