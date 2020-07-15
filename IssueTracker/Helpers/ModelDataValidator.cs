using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

/**
 *  Validasi Data dari Objek Kelas Tertentu yang Pakai Anotasi
 * 
 *  @author Mufid Jamaluddin
 **/
namespace IssueTracker.Helpers
{
    public static class ModelDataValidator
    {
        public static List<ValidationResult> ValidateModelData(this object instance, bool validateAllProperty = true)
        {
            ValidationContext context = new ValidationContext(instance);
            List<ValidationResult> results = new List<ValidationResult>();

            Validator.TryValidateObject(instance, context, results, validateAllProperty);

            return results;
        }
    }
}
