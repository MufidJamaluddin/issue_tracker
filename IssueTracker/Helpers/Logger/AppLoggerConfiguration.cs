using Microsoft.Extensions.Logging;

/**
 * 
 * @author Mufid Jamaluddin
 **/
namespace IssueTracker.Helpers.Logger
{
    public class AppLoggerConfiguration
    {
        public LogLevel LogLevel { get; set; } = LogLevel.Warning;
        public int EventId { get; set; } = 0;
    }
}
