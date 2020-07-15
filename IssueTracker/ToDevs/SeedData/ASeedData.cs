using IssueTracker.Models.Datas;

/**
 * 
 * @author Mufid Jamaluddin
 **/
namespace IssueTracker.ToDevs.SeedData
{
    public abstract class ASeedData : ISeed
    {
        protected IssueTrackerDbContext DbContext { get; private set; }

        public ASeedData(IssueTrackerDbContext dbContext)
        {
            DbContext = dbContext;
        }

        public virtual void RunSeed()
        {
            throw new System.NotImplementedException();
        }
    }
}
