using Newtonsoft.Json;

namespace IssueTracker.Models.ViewModels
{
    public class BaseVM
    {
        [JsonIgnore]
        public virtual bool IsDeleted { get; set; }
    }
}
