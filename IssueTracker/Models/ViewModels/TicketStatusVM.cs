using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace IssueTracker.Models.ViewModels
{
    public class TicketStatusVM : BaseVM
    {
        [StringLength(6)]
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        [Required]
        [StringLength(20)]
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

        [Required]
        [StringLength(10)]
        [JsonProperty(PropertyName = "color")]
        public string Color { get; set; }
    }
}
