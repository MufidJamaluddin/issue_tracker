/**
 * 
 * @author Mufid Jamaluddin
 **/
namespace IssueTracker.Models.ViewModels
{
    public class AuthenticateResponse
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }

        public AuthenticateResponse(UserVM user, string token)
        {
            if (user != null)
            {
                Id = user.Id;
                Email = user.Email;
                Name = user.Name;
                Token = token;
            }
        }
    }
}
