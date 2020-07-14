using System;

namespace IssueTracker.Models.Datas.Schemas
{
    public interface IBaseModel
    {
        public Boolean IsDeleted { get; set; }
    }
}
