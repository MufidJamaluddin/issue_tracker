using IssueTracker.Models.Datas;
using IssueTracker.Models.Repositories;
using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;

namespace IssueTracker.Services.Concrete
{
    public class CategoryServices : ICategoryServices
    {
        private ICategoryRepository CategoryRepository { get; }
        private ITransactionRepository TransactionRepository { get; }
        private ILogger<CategoryServices> Logger { get; }
        private IssueTrackerDbContext DbContext { get; }

        public CategoryServices(
            ILogger<CategoryServices> logger,
            IssueTrackerDbContext dbContext,
            ICategoryRepository CategoryRepository,
            ITransactionRepository TransactionRepository
        )
        {
            Logger = logger;
            DbContext = dbContext;
            this.CategoryRepository = CategoryRepository;
            this.TransactionRepository = TransactionRepository;
        }

        public CategoryVM GetDataById(string id)
        {
            return this.CategoryRepository.GetOne(new CategoryVM { Id = id });
        }

        public IEnumerable<CategoryVM> GetAllData()
        {
            IEnumerable<CategoryVM> data = CategoryRepository.GetAllData();
            return data;
        }

        public PaginationResponse<CategoryVM> GetDataWithPagination(PaginationRequest request)
        {
            SearchPaginationRequest<CategoryVM> nrequest = new SearchPaginationRequest<CategoryVM>(request);

            PaginationResponse<CategoryVM> data = CategoryRepository.GetDataPaginated(nrequest);

            return data;
        }

        public PaginationResponse<CategoryVM> SearchDataWithPagination(SearchPaginationRequest<CategoryVM> request)
        {
            return CategoryRepository.GetDataPaginated(request);
        }

        public CommonResponse<CategoryVM> SaveNewData(CategoryVM data, TableTransactionVM transaction)
        {
            CommonResponse<CategoryVM> result;

            using Microsoft.EntityFrameworkCore.Storage.IDbContextTransaction dbTransaction = DbContext.Database.BeginTransaction();

            try
            {
                string transactionId = TransactionRepository.InitializeTransaction(transaction);

                result = CategoryRepository.SaveData(data, transactionId);

                dbTransaction.Commit();
            }
            catch (Exception e)
            {
                dbTransaction.Rollback();

                Logger.LogError("Error Saving Category Data by IP Address {0} : {1}\nInner Ex : {2}",
                    transaction?.IpAddress ?? "",
                    e.Message ?? "",
                    e.InnerException?.Message ?? ""
                );

                result = new CommonResponse<CategoryVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Save Data Failed! Please Contact an Web Administrator!",
                    Data = new CategoryVM[] { data },
                };
            }

            return result;
        }

        public CommonResponse<CategoryVM> UpdateData(CategoryVM data, TableTransactionVM transaction)
        {
            CommonResponse<CategoryVM> result;

            using Microsoft.EntityFrameworkCore.Storage.IDbContextTransaction dbTransaction = DbContext.Database.BeginTransaction();

            try
            {
                string transactionId = TransactionRepository.InitializeTransaction(transaction);

                result = CategoryRepository.UpdateData(data, transactionId);

                dbTransaction.Commit();
            }
            catch (Exception e)
            {
                Logger.LogError("Error Updating Category Data by IP Address {0} : {1}\nInner Ex : {2}",
                    transaction?.IpAddress ?? "",
                    e.Message ?? "",
                    e.InnerException?.Message ?? ""
                );

                result = new CommonResponse<CategoryVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Update Data Failed! Please Contact an Web Administrator!",
                    Data = new CategoryVM[] { data },
                };
            }

            return result;
        }

        public CommonResponse<CategoryVM> DeleteData(CategoryVM data, TableTransactionVM transaction)
        {
            CommonResponse<CategoryVM> result;

            using Microsoft.EntityFrameworkCore.Storage.IDbContextTransaction dbTransaction = DbContext.Database.BeginTransaction();

            try
            {
                string transactionId = TransactionRepository.InitializeTransaction(transaction);

                result = CategoryRepository.DeleteData(data, transactionId);

                dbTransaction.Commit();
            }
            catch (Exception e)
            {
                Logger.LogError("Error Deleting Category Data by IP Address {0} : {1}\nInner Ex : {2}",
                     transaction?.IpAddress ?? "",
                     e.Message ?? "",
                     e.InnerException?.Message ?? ""
                );

                result = new CommonResponse<CategoryVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Delete Data Failed! Please Contact an Web Administrator!",
                    Data = new CategoryVM[] { data },
                };
            }

            return result;
        }
    }
}
