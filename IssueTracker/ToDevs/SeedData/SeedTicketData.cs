using IssueTracker.Models.Datas;
using IssueTracker.Models.Datas.Schemas;
using System;
using System.Collections.Generic;

using System.Linq;

/**
 * 
 * @author Mufid Jamaluddin
 **/
namespace IssueTracker.ToDevs.SeedData
{
    public class SeedTicketData : ASeedData
    {
        public SeedTicketData(IssueTrackerDbContext dbContext) : base(dbContext)
        {

        }

        public override void RunSeed()
        {
            if (!DbContext.Categories.Any())
            {
                DbContext.Categories.AddRange(new List<Category>
                {
                    new Category
                    {
                        Id = "CS-001",
                        Name = "Bug",
                    },
                    new Category
                    {
                        Id = "CS-002",
                        Name = "Duplicate",
                    },
                    new Category
                    {
                        Id = "CS-003",
                        Name = "Enhancement",
                    },
                    new Category
                    {
                        Id = "CS-004",
                        Name = "Question",
                    },
                });

                DbContext.SaveChanges();
            }

            if (!DbContext.TicketStatuses.Any())
            {
                DbContext.TicketStatuses.AddRange(new List<TicketStatus>
                {
                    new TicketStatus
                    {
                        Id = "TS-001",
                        Name = "Open",
                        Color = "warning",
                    },
                    new TicketStatus
                    {
                        Id = "TS-002",
                        Name = "In Progress",
                        Color = "info",
                    },
                    new TicketStatus
                    {
                        Id = "TS-003",
                        Name = "Done",
                        Color = "primary",
                    },
                    new TicketStatus
                    {
                        Id = "TS-004",
                        Name = "Closed",
                        Color = "dark",
                    },
                });

                DbContext.SaveChanges();
            }


            if (!DbContext.Tickets.Any())
            {
                DbContext.Tickets.AddRange(new List<Ticket>
                {
                    new Ticket
                    {
                        Id = "TC-001",
                        Name = "Add Test Case Code",
                        Description = "Add Unit Tests and Integration Test Project" +
                            " in IssueTracker System",

                        CreatedDate = DateTime.Now,

                        Assignee = DbContext.Users
                            .Where(u => u.Id == "USR-003")
                            .FirstOrDefault(),

                        Owner = DbContext.Users
                            .Where(u => u.Id == "USR-001")
                            .FirstOrDefault(),

                        Status = DbContext.TicketStatuses
                            .Where(u => u.Id == "TS-001")
                            .FirstOrDefault(),

                        Category = DbContext.Categories
                            .Where(u => u.Id == "CS-003")
                            .FirstOrDefault(),
                    },
                    new Ticket
                    {
                        Id = "TC-002",
                        Name = "Setup Code Coverage Tools",
                        Description = "Setup Code Coverage Tools" +
                            " in IssueTracker System",

                        CreatedDate = DateTime.Now,

                        Assignee = DbContext.Users
                            .Where(u => u.Id == "USR-001")
                            .FirstOrDefault(),

                        Owner = DbContext.Users
                            .Where(u => u.Id == "USR-004")
                            .FirstOrDefault(),

                        Status = DbContext.TicketStatuses
                            .Where(u => u.Id == "TS-001")
                            .FirstOrDefault(),

                        Category = DbContext.Categories
                            .Where(u => u.Id == "CS-003")
                            .FirstOrDefault(),
                    },
                });

                DbContext.SaveChanges();
            }
        }
    }
}
