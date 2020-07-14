using Newtonsoft.Json;
using System;

namespace IssueTracker.Models.ViewModels
{
    public class BaseVM
    {
        [JsonIgnore]
        public virtual Boolean IsDeleted { get; set; }
    }
}
