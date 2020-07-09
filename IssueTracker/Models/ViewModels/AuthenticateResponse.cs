
using Newtonsoft.Json;
/**
* 
* @author Mufid Jamaluddin
**/
namespace IssueTracker.Models.ViewModels
{
    public class AuthenticateResponse
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }
        
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }
        
        [JsonProperty(PropertyName = "email")]
        public string Email { get; set; }
        
        [JsonProperty(PropertyName = "image")]
        public string Image { get; set; }

        [JsonProperty(PropertyName = "token")]
        public string Token { get; set; }

        public AuthenticateResponse(UserVM user, string token)
        {
            if (user != null)
            {
                Id = user.Id;
                Email = user.Email;
                Image = user.Image;
                Name = user.Name;
                Token = token;
            }
        }
    }
}
