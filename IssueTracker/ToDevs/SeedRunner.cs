using IssueTracker.Models.Datas;
using IssueTracker.ToDevs.SeedData;
using System.Collections.Generic;

/**
 * 
 * @author Mufid Jamaluddin
 **/
namespace IssueTracker.ToDevs
{
    public static class SeedRunner
    {
        public static void Run(IssueTrackerDbContext dbContext)
        {
            List<ISeed> list = new List<ISeed>
            {
                new SeedUserData(dbContext),
                new SeedTicketData(dbContext),
            };

            list.ForEach(item =>
            {
                item.RunSeed();
            });

            list.Clear();
        }
    }
}
