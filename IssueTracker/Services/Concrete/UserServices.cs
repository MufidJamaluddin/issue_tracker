using IssueTracker.Models.Datas;
using IssueTracker.Models.Repositories;
using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;

namespace IssueTracker.Services.Concrete
{
    public class UserServices : IUserServices
    {
        private IUserRepository UserRepository { get; }
        private ITransactionRepository TransactionRepository { get; }
        private ILogger<UserServices> Logger { get; }
        private IssueTrackerDbContext DbContext { get; }

        public UserServices(
            ILogger<UserServices> logger,
            IssueTrackerDbContext dbContext,
            IUserRepository UserRepository,
            ITransactionRepository TransactionRepository
        )
        {
            Logger = logger;
            DbContext = dbContext;
            this.UserRepository = UserRepository;
            this.TransactionRepository = TransactionRepository;
        }

        public UserVM GetDataById(string id)
        {
            return this.UserRepository.GetOne(new UserVM { Id = id });
        }

        public IEnumerable<UserVM> GetAllData()
        {
            IEnumerable<UserVM> data = UserRepository.GetAllData();
            return data;
        }

        public PaginationResponse<UserVM> GetDataWithPagination(PaginationRequest request)
        {
            SearchPaginationRequest<UserVM> nrequest = new SearchPaginationRequest<UserVM>(request);

            PaginationResponse<UserVM> data = UserRepository.GetDataPaginated(nrequest);

            return data;
        }

        public PaginationResponse<UserVM> SearchDataWithPagination(SearchPaginationRequest<UserVM> request)
        {
            return UserRepository.GetDataPaginated(request);
        }

        public CommonResponse<UserVM> SaveNewData(UserVM data, TableTransactionVM transaction)
        {
            CommonResponse<UserVM> result;

            using Microsoft.EntityFrameworkCore.Storage.IDbContextTransaction dbTransaction = DbContext.Database.BeginTransaction();

            try
            {
                string transactionId = TransactionRepository.InitializeTransaction(transaction);

                result = UserRepository.SaveData(data, transactionId);

                dbTransaction.Commit();
            }
            catch (Exception e)
            {
                dbTransaction.Rollback();

                Logger.LogError("Error Saving User Data by IP Address {0} : {1}\nInner Ex : {2}",
                    transaction?.IpAddress ?? "",
                    e.Message ?? "",
                    e.InnerException?.Message ?? ""
                );

                result = new CommonResponse<UserVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Save Data Failed! Please Contact an Web Administrator!",
                    Data = new UserVM[] { data },
                };
            }

            return result;
        }

        public CommonResponse<UserVM> UpdateData(UserVM data, TableTransactionVM transaction)
        {
            CommonResponse<UserVM> result;

            using Microsoft.EntityFrameworkCore.Storage.IDbContextTransaction dbTransaction = DbContext.Database.BeginTransaction();

            try
            {
                string transactionId = TransactionRepository.InitializeTransaction(transaction);

                result = UserRepository.UpdateData(data, transactionId);

                dbTransaction.Commit();
            }
            catch (Exception e)
            {
                Logger.LogError("Error Updating User Data by IP Address {0} : {1}\nInner Ex : {2}",
                    transaction?.IpAddress ?? "",
                    e.Message ?? "",
                    e.InnerException?.Message ?? ""
                );

                result = new CommonResponse<UserVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Update Data Failed! Please Contact an Web Administrator!",
                    Data = new UserVM[] { data },
                };
            }

            return result;
        }

        public CommonResponse<UserVM> DeleteData(UserVM data, TableTransactionVM transaction)
        {
            CommonResponse<UserVM> result;

            using Microsoft.EntityFrameworkCore.Storage.IDbContextTransaction dbTransaction = DbContext.Database.BeginTransaction();

            try
            {
                string transactionId = TransactionRepository.InitializeTransaction(transaction);

                result = UserRepository.DeleteData(data, transactionId);

                dbTransaction.Commit();
            }
            catch (Exception e)
            {
                Logger.LogError("Error Deleting User Data by IP Address {0} : {1}\nInner Ex : {2}",
                     transaction?.IpAddress ?? "",
                     e.Message ?? "",
                     e.InnerException?.Message ?? ""
                );

                result = new CommonResponse<UserVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Delete Data Failed! Please Contact an Web Administrator!",
                    Data = new UserVM[] { data },
                };
            }

            return result;
        }
    }
}
