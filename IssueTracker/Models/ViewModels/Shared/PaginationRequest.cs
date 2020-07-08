using Newtonsoft.Json;
using System;

namespace IssueTracker.Models.ViewModels.Shared
{
    public class PaginationRequest
    {
        [JsonProperty(PropertyName = "page")]
        public int Page { get; set; }

        [JsonProperty(PropertyName = "size")]
        public int Size { get; set; }

        [JsonProperty(PropertyName = "orderby")]
        public string OrderBy { get; set; }

        [JsonProperty(PropertyName = "orderdirection")]
        public string OrderDirection { get; set; }

        [JsonIgnore]
        public bool IsOrderByAsc => string
                    .Compare(OrderDirection, "asc", StringComparison.OrdinalIgnoreCase)
                    == 0;

        [JsonIgnore]
        public int Offset => (Page - 1) * Size;

        public bool IsPaginationValid()
        {
            return Size > 0 && Page > 0;
        }
    }
}
