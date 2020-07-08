using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

/**
 * 
 * @author Mufid Jamaluddin
 **/
namespace IssueTracker.Models.ViewModels
{
    public class UserVM
    {
        [StringLength(10)]
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        [StringLength(100)]
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

        [StringLength(10)]
        [JsonProperty(PropertyName = "role", NullValueHandling = NullValueHandling.Ignore)]
        public string Role { get; set; }

        [StringLength(256)]
        [JsonProperty(PropertyName = "email")]
        public string Email { get; set; }

        [StringLength(256)]
        [JsonProperty(PropertyName = "password")]
        public string Password { get; set; }

        [StringLength(100)]
        public string Image { get; set; }

        /**
         *  JANGAN SERIALISASI PASSWORD
         **/
        public bool ShouldSerializePassword()
        {
            return false;
        }
    }
}
