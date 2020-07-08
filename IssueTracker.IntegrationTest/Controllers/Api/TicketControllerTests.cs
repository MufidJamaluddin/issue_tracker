using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;
using Newtonsoft.Json;
using System.Net.Http;
using Xunit;

/**
 * 
 * @author Mufid Jamaluddin
 **/
namespace IssueTracker.IntegrationTest.Controllers.Api
{
    public class TicketControllerTests : IClassFixture<IntegrationTestWebAppFactory<Startup>>
    {
        private readonly HttpClient _client;

        public TicketControllerTests(IntegrationTestWebAppFactory<Startup> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async void TestSuccessGetData()
        {
            HttpResponseMessage httpResponse = await _client.GetAsync("/api/Ticket?page=1&size=10");

            httpResponse.EnsureSuccessStatusCode();

            string response = await httpResponse.Content.ReadAsStringAsync();
            PaginationResponse<TicketVM> responseData = JsonConvert.DeserializeObject<PaginationResponse<TicketVM>>(response);

            Assert.True(responseData.Status);
            Assert.Equal("S", responseData.Code);
            Assert.Equal("Retrieve Data is Success!", responseData.Message);
        }

        [Fact]
        public async void TestErrorGetData()
        {
            HttpResponseMessage httpResponse = await _client.GetAsync("/api/ticket?page=0&size=10");

            httpResponse.EnsureSuccessStatusCode();

            string response = await httpResponse.Content.ReadAsStringAsync();
            PaginationResponse<TicketVM> responseData = JsonConvert.DeserializeObject<PaginationResponse<TicketVM>>(response);

            Assert.False(responseData.Status);
            Assert.Equal("E-002", responseData.Code);
            Assert.Equal(
                "The value of page and size must be higher than zero!",
                responseData.Message);
        }
    }
}
