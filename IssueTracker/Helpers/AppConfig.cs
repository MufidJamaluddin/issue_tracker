/**
 * App Config Data Type
 * 
 * @author Mufid Jamaluddin
 **/
namespace IssueTracker.Helpers
{
    public class AppConfig
    {
        public string Secret { get; set; }
        public bool UseHttps { get; set; }
        public bool SensitiveDataLogging { get; set; }
    }
}
