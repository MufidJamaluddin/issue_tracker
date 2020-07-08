using System;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;

/**
 *  Mengecek Apakah Password Terdapat Upercase, Lowercase, dan Angka
 *  
 *  @author Mufid Jamaluddin
 ***/
namespace IssueTracker.Helpers.Validation
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
    public sealed class CharPasswordValidator : ValidationAttribute
    {
        public bool HasUppercase { get; set; }
        public bool HasLowercase { get; set; }
        public bool HasNumber { get; set; }

        public override bool IsValid(object value)
        {
            string password = (string)value;
            bool valid = true;

            if (HasUppercase)
            {
                valid = valid && password.Where(char.IsUpper).Any();
            }

            if (HasLowercase)
            {
                valid = valid && password.Where(char.IsLower).Any();
            }

            if (HasNumber)
            {
                valid = valid && password.Where(char.IsDigit).Any();
            }

            return valid;
        }

        public override string FormatErrorMessage(string name)
        {
            return string.Format(CultureInfo.CurrentCulture, ErrorMessageString, name);
        }
    }
}
