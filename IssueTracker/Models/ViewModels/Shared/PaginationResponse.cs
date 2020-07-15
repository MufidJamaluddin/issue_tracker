using Newtonsoft.Json;

/**
 * 
 * @author Mufid Jamaluddin
 **/
namespace IssueTracker.Models.ViewModels.Shared
{
    public class PaginationResponse<T> : CommonResponse<T>
    {
        [JsonProperty(PropertyName = "size")]
        public int PageSize { get; set; }

        [JsonProperty(PropertyName = "page")]
        public int CurrentPage { get; set; }

        [JsonProperty(PropertyName = "totalPages")]
        public int TotalPages { get; set; }
    }
}
