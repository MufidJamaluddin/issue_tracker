using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;

namespace IssueTracker.Models.Datas.Schemas
{
    public class Log
    {
        [Required]
        public LogLevel LogLevel { get; set; }

        [Required]
        public int EventId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        public string Message { get; set; }
    }
}
