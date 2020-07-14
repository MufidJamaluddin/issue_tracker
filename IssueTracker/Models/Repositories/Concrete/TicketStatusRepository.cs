using IssueTracker.Models.Datas;
using IssueTracker.Models.Datas.Schemas;
using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;
using System.Globalization;
using System.Linq;

namespace IssueTracker.Models.Repositories
{
    public class TicketStatusRepository : ABaseRepository<TicketStatusVM>, ITicketStatusRepository
    {
        public TicketStatusRepository(IssueTrackerDbContext dbContext) : base(dbContext) { }

        public override IQueryable<TicketStatusVM> GetModel()
        {
            IQueryable<TicketStatusVM> model = DbContext.TicketStatuses.Select(u => new TicketStatusVM
            {
                Id = u.Id,
                Name = u.Name,
                Color = u.Color,
                IsDeleted = u.IsDeleted,
            });

            return model;
        }

        protected string CreateNewTicketStatusId(string lastId)
        {
            if (lastId == null)
            {
                return "TS-001";
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

        public override CommonResponse<TicketStatusVM> SaveData(TicketStatusVM data, string transactionId)
        {
            CommonResponse<TicketStatusVM> response = ValidateParameter(data);

            if (response != null)
            {
                return response;
            }

            string lastId = DbContext.TicketStatuses.Select(u => u.Id).OrderByDescending(u => u).FirstOrDefault();

            TicketStatus ticketStatusData = new TicketStatus
            {
                Id = CreateNewTicketStatusId(lastId),
                Name = data?.Name,
            };

            DbContext.Add(ticketStatusData);

            TicketStatusHistory ticketStatusHistory = new TicketStatusHistory();
            ticketStatusHistory.FillFromTicketStatus(
                ticketStatusData,
                transactionId,
                1,
                TableTransactionOperation.Insert
            );

            DbContext.Add(ticketStatusHistory);

            if (DbContext.SaveChanges() > 0)
            {
                data.Id = ticketStatusData.Id;

                return new CommonResponse<TicketStatusVM>
                {
                    Status = true,
                    Code = "S",
                    Message = "Retrieve Data is Success!",
                    Data = new TicketStatusVM[] { data },
                };
            }
            else
            {
                return new CommonResponse<TicketStatusVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Save Data Failed! Please Contact an Web Administrator!",
                    Data = new TicketStatusVM[] { data },
                };
            }
        }

        public override CommonResponse<TicketStatusVM> UpdateData(TicketStatusVM data, string transactionId)
        {
            CommonResponse<TicketStatusVM> response = ValidateParameter(data);

            if (response != null)
            {
                return response;
            }

            if (string.IsNullOrEmpty(data?.Id))
            {
                return new CommonResponse<TicketStatusVM>
                {
                    Status = false,
                    Code = "E-001",
                    Message = "Please fill the ID!",
                    Data = new TicketStatusVM[] { data },
                };
            }

            IQueryable<TicketStatus> lastDataContext = DbContext.TicketStatuses.AsQueryable();

            lastDataContext = lastDataContext.Where(u =>
                u.Id.Equals(data.Id)
            );

            TicketStatus lastData = lastDataContext.FirstOrDefault();

            if (lastData == null)
            {
                return new CommonResponse<TicketStatusVM>
                {
                    Status = false,
                    Code = "E-004",
                    Message = "Ubah Data Gagal! Data Tidak Ditemukan!",
                    Data = new TicketStatusVM[] { data },
                };
            }

            lastData.Name = data.Name;

            //DbContext.Add(lastData);

            int historySequence = lastData.TicketStatusHistories
                .Select(u => u.Seq)
                .OrderByDescending(u => u)
                .FirstOrDefault();

            TicketStatusHistory ticketStatusHistory = new TicketStatusHistory();
            ticketStatusHistory.FillFromTicketStatus(
                lastData,
                transactionId,
                historySequence + 1,
                TableTransactionOperation.Update
            );

            DbContext.Add(ticketStatusHistory);

            if (DbContext.SaveChanges() > 0)
            {
                return new CommonResponse<TicketStatusVM>
                {
                    Status = true,
                    Code = "S",
                    Message = "Save Data is Success!",
                    Data = new TicketStatusVM[] { data },
                };
            }
            else
            {
                return new CommonResponse<TicketStatusVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Save Data Failed! Please Contact an Web Administrator!",
                    Data = new TicketStatusVM[] { data },
                };
            }
        }

        public override CommonResponse<TicketStatusVM> DeleteData(TicketStatusVM data, string transactionId)
        {
            IQueryable<TicketStatus> lastDataContext = DbContext.TicketStatuses.AsQueryable();

            if (string.IsNullOrEmpty(data?.Id))
            {
                return new CommonResponse<TicketStatusVM>
                {
                    Status = false,
                    Code = "E-001",
                    Message = "Please fill the ID!",
                    Data = new TicketStatusVM[] { data },
                };
            }

            lastDataContext = lastDataContext.Where(u =>
                u.Id.Equals(data.Id)
            );

            TicketStatus lastData = lastDataContext.FirstOrDefault();

            int historySequence = lastData.TicketStatusHistories
                .Select(u => u.Seq)
                .OrderByDescending(u => u)
                .FirstOrDefault();

            lastData.IsDeleted = true;

            TicketStatusHistory ticketStatusHistory = new TicketStatusHistory();
            ticketStatusHistory.FillFromTicketStatus(
                lastData,
                transactionId,
                historySequence + 1,
                TableTransactionOperation.Update
            );

            DbContext.Add(ticketStatusHistory);

            if (DbContext.SaveChanges() > 0)
            {
                return new CommonResponse<TicketStatusVM>
                {
                    Status = true,
                    Code = "S",
                    Message = "Delete Data is Success!",
                    Data = new TicketStatusVM[] { data },
                };
            }
            else
            {
                return new CommonResponse<TicketStatusVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Delete Data Failed! Please Contact an Web Administrator!",
                    Data = new TicketStatusVM[] { data },
                };
            }
        }
    }
}
