using IssueTracker.Models.Datas;
using IssueTracker.Models.Datas.Schemas;
using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;
using System.Globalization;
using System.Linq;

namespace IssueTracker.Models.Repositories
{
    public class TicketRepository : ABaseRepository<TicketVM>, ITicketRepository
    {
        public TicketRepository(IssueTrackerDbContext dbContext) : base(dbContext) { }

        public override IQueryable<TicketVM> GetModel()
        {
            IQueryable<TicketVM> model = DbContext.Tickets.Select(u => new TicketVM
            {
                Id = u.Id,
                Name = u.Name,
                Description = u.Description,
                CreatedDate = u.CreatedDate,

                AssigneeName = u.Assignee.Name,
                AssigneeId = u.Assignee.Id,

                OwnerName = u.Owner.Name,
                OwnerID = u.Owner.Id,

                CategoryName = u.Category.Name,
                CategoryID = u.Category.Id,

                StatusName = u.Status.Name,
                StatusID = u.Status.Id,
                StatusColor = u.Status.Color,
            });

            return model;
        }

        public override IQueryable<TicketVM> GetSearchedModel(TicketVM searchedData)
        {
            IQueryable<TicketVM> model = GetModel();

            model = model.Where(u => u.Id == searchedData.Id);

            return model;
        }

        public override IQueryable<TicketVM> GetSearchedModel(SearchPaginationRequest<TicketVM> request)
        {
            IQueryable<TicketVM> model = GetModel();

            string id = request?.SearchData?.Id;
            string name = request?.SearchData?.Name;
            string myuserid = request?.SearchData?.MyUserId;
            string statusID = request?.SearchData?.StatusID;

            if (!string.IsNullOrEmpty(id))
            {
                model = model.Where(u => u.Id == id);
            }

            if (!string.IsNullOrEmpty(name))
            {
                model = model.Where(u => u.Name.Contains(name));
            }

            if (!string.IsNullOrEmpty(statusID))
            {
                model = model.Where(u => u.StatusID == statusID);
            }

            if (
                !string.IsNullOrEmpty(request?.SearchData?.SeeType) &&
                !string.IsNullOrEmpty(request?.SearchData?.MyUserId)
            )
            {
                switch (request.SearchData.SeeType)
                {
                    case "1": model = model.Where(u => u.OwnerID == myuserid); break;
                    case "2": model = model.Where(u => u.AssigneeId == myuserid); break;
                }
            }

            return model;
        }

        protected string CreateNewTicketId(string lastId)
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

        public override CommonResponse<TicketVM> SaveData(TicketVM data, string transactionId)
        {
            CommonResponse<TicketVM> response = ValidateParameter(data);

            if (response != null)
            {
                return response;
            }

            User assignee = DbContext.Users.Where(u => u.Id == data.AssigneeId).FirstOrDefault();
            User owner = DbContext.Users.Where(u => u.Id == data.OwnerID).FirstOrDefault();
            Category category = DbContext.Categories.Where(u => u.Id == data.CategoryID).FirstOrDefault();
            TicketStatus status = DbContext.TicketStatuses.Where(u => u.Id == data.StatusID).FirstOrDefault();

            string error_message = "";

            if (assignee == null)
            {
                error_message += "Assignee must be filled!, ";
            }

            if (owner == null)
            {
                error_message += "Owner must be filled!, ";
            }

            if (category == null)
            {
                error_message += "Category must be filled!, ";
            }

            if (status == null)
            {
                error_message += "Status must be filled!, ";
            }

            if (string.IsNullOrEmpty(error_message))
            {
                return new CommonResponse<TicketVM>
                {
                    Status = false,
                    Code = "E-002",
                    Message = error_message,
                    Data = new TicketVM[] { data },
                };
            }

            string lastId = DbContext.Tickets.Select(u => u.Id).OrderByDescending(u => u).FirstOrDefault();

            Ticket ticketData = new Ticket
            {
                Id = CreateNewTicketId(lastId),
                Name = data?.Name,
                Description = data.Description,
                CreatedDate = data.CreatedDate,

                Assignee = assignee,
                Owner = owner,
                Category = category,
                Status = status,
            };

            DbContext.Add(ticketData);

            TicketHistory ticketHistory = new TicketHistory();
            ticketHistory.FillFromTicket(
                ticketData,
                transactionId,
                1,
                TableTransactionOperation.Insert
            );

            DbContext.Add(ticketHistory);

            if (DbContext.SaveChanges() > 0)
            {
                data.Id = ticketData.Id;

                return new CommonResponse<TicketVM>
                {
                    Status = true,
                    Code = "S",
                    Message = "Save Data is Success!",
                    Data = new TicketVM[] { data },
                };
            }
            else
            {
                return new CommonResponse<TicketVM>
                {
                    Status = true,
                    Code = "E-003",
                    Message = "Save Data Failed! Please Contact an Web Administrator!",
                    Data = new TicketVM[] { data },
                };
            }
        }

        public CommonResponse<TicketVM> UpdateData(TicketVM data, string transactionId, string loggedUserId)
        {
            CommonResponse<TicketVM> response = ValidateParameter(data);

            if (response != null)
            {
                return response;
            }

            User assignee = DbContext.Users.Where(u => u.Id == data.AssigneeId).FirstOrDefault();
            Category category = DbContext.Categories.Where(u => u.Id == data.CategoryID).FirstOrDefault();
            TicketStatus status = DbContext.TicketStatuses.Where(u => u.Id == data.StatusID).FirstOrDefault();

            if (data?.Id == null)
            {
                return new CommonResponse<TicketVM>
                {
                    Status = false,
                    Code = "E-002",
                    Message = "Invalid update data, please fill the ID!",
                    Data = new TicketVM[] { data },
                };
            }

            Ticket lastData = DbContext.Tickets.Where(u => u.Id == data.Id).FirstOrDefault();

            if(lastData == null)
            {
                return new CommonResponse<TicketVM>
                {
                    Status = false,
                    Code = "E-002",
                    Message = string.Format("Data not found for ID {0}, please fill the right ID!", data?.Id),
                    Data = new TicketVM[] { data },
                };
            }

            lastData.Name = data.Name;
            lastData.Description = data.Description;
            lastData.CreatedDate = data.CreatedDate;

            if (assignee != null)
            {
                lastData.Assignee = assignee;
            }

            if (category != null)
            {
                lastData.Category = category;
            }

            if (status != null && lastData.Assignee?.Id == loggedUserId)
            {
                lastData.Status = status;
            }

            //DbContext.Add(lastData);

            int historySequence = lastData?.TicketHistories?
                .Select(u => u.Seq)
                .OrderByDescending(u => u)
                .FirstOrDefault() ?? 0;

            TicketHistory ticketHistory = new TicketHistory();
            ticketHistory.FillFromTicket(
                lastData,
                transactionId,
                historySequence + 1,
                TableTransactionOperation.Update
            );

            DbContext.Add(ticketHistory);

            if (DbContext.SaveChanges() > 0)
            {
                return new CommonResponse<TicketVM>
                {
                    Status = true,
                    Code = "S",
                    Message = "Update Data is Success!",
                    Data = new TicketVM[] { data },
                };
            }
            else
            {
                return new CommonResponse<TicketVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Update Data Failed! Please Contact an Web Administrator!",
                    Data = new TicketVM[] { data },
                };
            }
        }

        public override CommonResponse<TicketVM> UpdateData(TicketVM data, string transactionId)
        {
            CommonResponse<TicketVM> response = ValidateParameter(data);

            if (response != null)
            {
                return response;
            }

            User assignee = DbContext.Users.Where(u => u.Id == data.AssigneeId).FirstOrDefault();
            Category category = DbContext.Categories.Where(u => u.Id == data.CategoryID).FirstOrDefault();
            TicketStatus status = DbContext.TicketStatuses.Where(u => u.Id == data.StatusID).FirstOrDefault();

            if (data?.Id == null)
            {
                return new CommonResponse<TicketVM>
                {
                    Status = false,
                    Code = "E-002",
                    Message = "Invalid update data, please fill the ID!",
                    Data = new TicketVM[] { data },
                };
            }

            Ticket lastData = DbContext.Tickets.Where(u => u.Id == data.Id).FirstOrDefault();

            if (lastData == null)
            {
                return new CommonResponse<TicketVM>
                {
                    Status = false,
                    Code = "E-002",
                    Message = string.Format("Data not found for ID {0}, please fill the right ID!", data?.Id),
                    Data = new TicketVM[] { data },
                };
            }

            lastData.Name = data.Name;
            lastData.Description = data.Description;
            lastData.CreatedDate = data.CreatedDate;

            if (assignee != null)
            {
                lastData.Assignee = assignee;
            }

            if (category != null)
            {
                lastData.Category = category;
            }

            if (status != null)
            {
                lastData.Status = status;
            }

            //DbContext.Add(lastData);

            int historySequence = lastData?.TicketHistories?
                .Select(u => u.Seq)
                .OrderByDescending(u => u)
                .FirstOrDefault() ?? 0;

            TicketHistory ticketHistory = new TicketHistory();
            ticketHistory.FillFromTicket(
                lastData,
                transactionId,
                historySequence + 1,
                TableTransactionOperation.Update
            );

            DbContext.Add(ticketHistory);

            if (DbContext.SaveChanges() > 0)
            {
                return new CommonResponse<TicketVM>
                {
                    Status = true,
                    Code = "S",
                    Message = "Update Data is Success!",
                    Data = new TicketVM[] { data },
                };
            }
            else
            {
                return new CommonResponse<TicketVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Update Data Failed! Please Contact an Web Administrator!",
                    Data = new TicketVM[] { data },
                };
            }
        }

        public override CommonResponse<TicketVM> DeleteData(TicketVM data, string transactionId)
        {
            IQueryable<Ticket> lastDataContext = DbContext.Tickets.AsQueryable();

            if (string.IsNullOrEmpty(data?.Id))
            {
                return new CommonResponse<TicketVM>
                {
                    Status = false,
                    Code = "E-001",
                    Message = "Please fill the ID!",
                    Data = new TicketVM[] { data },
                };
            }

            lastDataContext = lastDataContext.Where(u =>
                u.Id.Equals(data.Id)
            );

            Ticket lastData = lastDataContext.FirstOrDefault();

            if (lastData == null)
            {
                return new CommonResponse<TicketVM>
                {
                    Status = false,
                    Code = "E-002",
                    Message = string.Format("Data not found for ID {0}, please fill the right ID!", data?.Id),
                    Data = new TicketVM[] { data },
                };
            }

            int historySequence = lastData?.TicketHistories?
                .Select(u => u.Seq)
                .OrderByDescending(u => u)
                .FirstOrDefault() ?? 0;

            DbContext.Tickets.Remove(lastData);

            TicketHistory ticketHistory = new TicketHistory();
            ticketHistory.FillFromTicket(
                lastData,
                transactionId,
                historySequence + 1,
                TableTransactionOperation.Delete
            );

            DbContext.Add(ticketHistory);

            if (DbContext.SaveChanges() > 0)
            {
                return new CommonResponse<TicketVM>
                {
                    Status = true,
                    Code = "S",
                    Message = "Delete Data is Success!",
                    Data = new TicketVM[] { data },
                };
            }
            else
            {
                return new CommonResponse<TicketVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Delete Data Failed! Please Contact an Web Administrator!",
                    Data = new TicketVM[] { data },
                };
            }
        }
    }
}
