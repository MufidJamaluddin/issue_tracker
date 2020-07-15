using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;

/**
 * 
 * @author Mufid Jamaluddin
 **/
namespace IssueTracker.Helpers.Logger
{
    public sealed class AppLoggerProvider : ILoggerProvider
    {
        private readonly AppLoggerConfiguration _config;
        private readonly ConcurrentDictionary<string, AppLogger> _loggers
            = new ConcurrentDictionary<string, AppLogger>();
        private readonly DbContext _dbContext;

        public AppLoggerProvider(AppLoggerConfiguration config, DbContext dbContext)
        {
            _config = config;
            _dbContext = dbContext;
        }

        public ILogger CreateLogger(string categoryName)
        {
            return _loggers.GetOrAdd(
                categoryName,
                name => new AppLogger(_config, _dbContext, name)
            );
        }

        public void Dispose()
        {
            _loggers.Clear();
        }
    }
}
