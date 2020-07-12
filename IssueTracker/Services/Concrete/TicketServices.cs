using IssueTracker.Models.Datas;
using IssueTracker.Models.Repositories;
using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;

namespace IssueTracker.Services.Concrete
{
    public class TicketServices : ITicketServices
    {
        private ITicketRepository TicketRepository { get; }
        private ITransactionRepository TransactionRepository { get; }
        private ILogger<TicketServices> Logger { get; }
        private IssueTrackerDbContext DbContext { get; }

        public TicketServices(
            ILogger<TicketServices> logger,
            IssueTrackerDbContext dbContext,
            ITicketRepository TicketRepository,
            ITransactionRepository TransactionRepository
        )
        {
            Logger = logger;
            DbContext = dbContext;
            this.TicketRepository = TicketRepository;
            this.TransactionRepository = TransactionRepository;
        }

        public IEnumerable<TicketVM> GetAllData()
        {
            IEnumerable<TicketVM> data = TicketRepository.GetAllData();
            return data;
        }

        public TicketVM GetDataById(string id)
        {
            return this.TicketRepository.GetOne(new TicketVM { Id = id });
        }

        public PaginationResponse<TicketVM> GetDataWithPagination(PaginationRequest request)
        {
            SearchPaginationRequest<TicketVM> nrequest = new SearchPaginationRequest<TicketVM>(request);

            PaginationResponse<TicketVM> data = TicketRepository.GetDataPaginated(nrequest);

            return data;
        }

        public PaginationResponse<TicketVM> SearchDataWithPagination(SearchPaginationRequest<TicketVM> request)
        {
            return TicketRepository.GetDataPaginated(request);
        }

        public CommonResponse<TicketVM> SaveNewData(TicketVM data, TableTransactionVM transaction)
        {
            CommonResponse<TicketVM> result;

            using Microsoft.EntityFrameworkCore.Storage.IDbContextTransaction dbTransaction = DbContext.Database.BeginTransaction();

            try
            {
                string transactionId = TransactionRepository.InitializeTransaction(transaction);

                result = TicketRepository.SaveData(data, transactionId);

                dbTransaction.Commit();
            }
            catch (Exception e)
            {
                dbTransaction.Rollback();

                Logger.LogError("Error Saving Ticket Data by IP Address {0} : {1}\nInner Ex : {2}",
                    transaction?.IpAddress ?? "",
                    e.Message ?? "",
                    e.InnerException?.Message ?? ""
                );

                result = new CommonResponse<TicketVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Save Data Failed! Please Contact an Web Administrator!",
                    Data = new TicketVM[] { data },
                };
            }

            return result;
        }

        public CommonResponse<TicketVM> UpdateData(TicketVM data, TableTransactionVM transaction)
        {
            CommonResponse<TicketVM> result;

            using Microsoft.EntityFrameworkCore.Storage.IDbContextTransaction dbTransaction = DbContext.Database.BeginTransaction();

            try
            {
                string transactionId = TransactionRepository.InitializeTransaction(transaction);

                result = TicketRepository.UpdateData(data, transactionId);

                dbTransaction.Commit();
            }
            catch (Exception e)
            {
                Logger.LogError("Error Updating Ticket Data by IP Address {0} : {1}\nInner Ex : {2}",
                    transaction?.IpAddress ?? "",
                    e.Message ?? "",
                    e.InnerException?.Message ?? ""
                );

                result = new CommonResponse<TicketVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Update Data Failed! Please Contact an Web Administrator!",
                    Data = new TicketVM[] { data },
                };
            }

            return result;
        }

        public CommonResponse<TicketVM> DeleteData(TicketVM data, TableTransactionVM transaction)
        {
            CommonResponse<TicketVM> result;

            using Microsoft.EntityFrameworkCore.Storage.IDbContextTransaction dbTransaction = DbContext.Database.BeginTransaction();

            try
            {
                string transactionId = TransactionRepository.InitializeTransaction(transaction);

                result = TicketRepository.DeleteData(data, transactionId);

                dbTransaction.Commit();
            }
            catch (Exception e)
            {
                Logger.LogError("Error Deleting Ticket Data by IP Address {0} : {1}\nInner Ex : {2}",
                     transaction?.IpAddress ?? "",
                     e.Message ?? "",
                     e.InnerException?.Message ?? ""
                );

                result = new CommonResponse<TicketVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Save Data Failed! Please Contact an Web Administrator!",
                    Data = new TicketVM[] { data },
                };
            }

            return result;
        }
    }
}
