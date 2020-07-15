using Newtonsoft.Json;

/**
 * 
 * @author Mufid Jamaluddin
 **/
namespace IssueTracker.Models.ViewModels.Shared
{
    public class SearchPaginationRequest<T> : PaginationRequest
    {
        public SearchPaginationRequest()
        {

        }

        public SearchPaginationRequest(PaginationRequest request)
        {
            Page = request?.Page ?? 0;
            Size = request?.Size ?? 10;
            OrderBy = request?.OrderBy;
            OrderDirection = request?.OrderDirection;
        }

        [JsonProperty(PropertyName = "searchdata")]
        public T SearchData { get; set; }
    }
}
