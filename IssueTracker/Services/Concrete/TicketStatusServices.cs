using IssueTracker.Models.Datas;
using IssueTracker.Models.Repositories;
using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;

namespace IssueTracker.Services.Concrete
{
    public class TicketStatusServices : ITicketStatusServices
    {
        private ITicketStatusRepository TicketStatusRepository { get; }
        private ITransactionRepository TransactionRepository { get; }
        private ILogger<TicketStatusServices> Logger { get; }
        private IssueTrackerDbContext DbContext { get; }

        public TicketStatusServices(
            ILogger<TicketStatusServices> logger,
            IssueTrackerDbContext dbContext,
            ITicketStatusRepository TicketStatusRepository,
            ITransactionRepository TransactionRepository
        )
        {
            Logger = logger;
            DbContext = dbContext;
            this.TicketStatusRepository = TicketStatusRepository;
            this.TransactionRepository = TransactionRepository;
        }

        public IEnumerable<TicketStatusVM> GetAllData()
        {
            IEnumerable<TicketStatusVM> data = TicketStatusRepository.GetAllData();
            return data;
        }

        public PaginationResponse<TicketStatusVM> GetDataWithPagination(PaginationRequest request)
        {
            SearchPaginationRequest<TicketStatusVM> nrequest = new SearchPaginationRequest<TicketStatusVM>(request);

            PaginationResponse<TicketStatusVM> data = TicketStatusRepository.GetDataPaginated(nrequest);

            return data;
        }

        public PaginationResponse<TicketStatusVM> SearchDataWithPagination(SearchPaginationRequest<TicketStatusVM> request)
        {
            return TicketStatusRepository.GetDataPaginated(request);
        }

        public CommonResponse<TicketStatusVM> SaveNewData(TicketStatusVM data, TableTransactionVM transaction)
        {
            CommonResponse<TicketStatusVM> result;

            using Microsoft.EntityFrameworkCore.Storage.IDbContextTransaction dbTransaction = DbContext.Database.BeginTransaction();

            try
            {
                string transactionId = TransactionRepository.InitializeTransaction(transaction);

                result = TicketStatusRepository.SaveData(data, transactionId);

                dbTransaction.Commit();
            }
            catch (Exception e)
            {
                dbTransaction.Rollback();

                Logger.LogError("Error Saving TicketStatus Data by IP Address {0} : {1}\nInner Ex : {2}",
                    transaction?.IpAddress ?? "",
                    e.Message ?? "",
                    e.InnerException?.Message ?? ""
                );

                result = new CommonResponse<TicketStatusVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Save Data Failed! Please Contact an Web Administrator!",
                    Data = new TicketStatusVM[] { data },
                };
            }

            return result;
        }

        public CommonResponse<TicketStatusVM> UpdateData(TicketStatusVM data, TableTransactionVM transaction)
        {
            CommonResponse<TicketStatusVM> result;

            using Microsoft.EntityFrameworkCore.Storage.IDbContextTransaction dbTransaction = DbContext.Database.BeginTransaction();

            try
            {
                string transactionId = TransactionRepository.InitializeTransaction(transaction);

                result = TicketStatusRepository.UpdateData(data, transactionId);

                dbTransaction.Commit();
            }
            catch (Exception e)
            {
                Logger.LogError("Error Updating TicketStatus Data by IP Address {0} : {1}\nInner Ex : {2}",
                    transaction?.IpAddress ?? "",
                    e.Message ?? "",
                    e.InnerException?.Message ?? ""
                );

                result = new CommonResponse<TicketStatusVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Update Data Failed! Please Contact an Web Administrator!",
                    Data = new TicketStatusVM[] { data },
                };
            }

            return result;
        }

        public CommonResponse<TicketStatusVM> DeleteData(TicketStatusVM data, TableTransactionVM transaction)
        {
            CommonResponse<TicketStatusVM> result;

            using Microsoft.EntityFrameworkCore.Storage.IDbContextTransaction dbTransaction = DbContext.Database.BeginTransaction();

            try
            {
                string transactionId = TransactionRepository.InitializeTransaction(transaction);

                result = TicketStatusRepository.DeleteData(data, transactionId);

                dbTransaction.Commit();
            }
            catch (Exception e)
            {
                Logger.LogError("Error Deleting TicketStatus Data by IP Address {0} : {1}\nInner Ex : {2}",
                     transaction?.IpAddress ?? "",
                     e.Message ?? "",
                     e.InnerException?.Message ?? ""
                );

                result = new CommonResponse<TicketStatusVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Save Data Failed! Please Contact an Web Administrator!",
                    Data = new TicketStatusVM[] { data },
                };
            }

            return result;
        }
    }
}
