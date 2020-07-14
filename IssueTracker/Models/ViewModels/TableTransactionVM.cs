using System;

namespace IssueTracker.Models.ViewModels
{
    public class TableTransactionVM : BaseVM
    {
        public string UserId { get; set; }
        public string IpAddress { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
