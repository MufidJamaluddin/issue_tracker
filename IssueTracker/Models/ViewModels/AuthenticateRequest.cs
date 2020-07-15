using IssueTracker.Helpers.Validation;
using System.ComponentModel.DataAnnotations;

/**
 * 
 * @author Mufid Jamaluddin
 **/
namespace IssueTracker.Models.ViewModels
{
    public class AuthenticateRequest
    {
        [Required]
        [StringLength(256), EmailAddress]
        public string Email { get; set; }

        [Required]
        [
            MinLength(8),
            MaxLength(256),
            CharPasswordValidator(
                HasLowercase = true,
                HasUppercase = true,
                HasNumber = true,
                ErrorMessage = "Password must be combination of lowercase, uppercase, and number"
            )
        ]
        public string Password { get; set; }
    }
}
