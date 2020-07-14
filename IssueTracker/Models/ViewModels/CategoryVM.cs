using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

/**
 * 
 * @author Mufid Jamaluddin
 **/
namespace IssueTracker.Models.ViewModels
{
    public class CategoryVM : BaseVM
    {
        [StringLength(10)]
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        [StringLength(100)]
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }
    }
}
