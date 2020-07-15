using IssueTracker.Models.Datas.Schemas;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;

/**
 * 
 * @author Mufid Jamaluddin
 **/
namespace IssueTracker.Helpers.Logger
{
    public class AppLogger : ILogger
    {
        private readonly AppLoggerConfiguration _config;
        private readonly DbContext _dbContext;
        private readonly string _name;

        public AppLogger(
            AppLoggerConfiguration config,
            DbContext dbContext,
            string name
        )
        {
            _config = config;
            _dbContext = dbContext;
            _name = name;
        }

        public IDisposable BeginScope<TState>(TState state)
        {
            return null;
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            return logLevel == _config.LogLevel;
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
        {
            if (!IsEnabled(logLevel) || formatter == null)
            {
                return;
            }

            if (eventId == 0 || _config.EventId == eventId.Id)
            {
                Log log = new Log()
                {
                    LogLevel = logLevel,
                    EventId = eventId.Id,
                    Name = _name,
                    Message = formatter(state, exception),
                    CreatedDate = DateTime.Now
                };

                _dbContext.Add(log);
                _dbContext.SaveChanges();
            }
        }
    }
}
