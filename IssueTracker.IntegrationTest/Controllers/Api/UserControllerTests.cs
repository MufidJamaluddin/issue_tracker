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
    public class UserControllerTests : IClassFixture<IntegrationTestWebAppFactory<Startup>>
    {
        private readonly HttpClient _client;

        public UserControllerTests(IntegrationTestWebAppFactory<Startup> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async void TestSuccessGetData()
        {
            HttpResponseMessage httpResponse = await _client.GetAsync("/api/user?page=1&size=10");

            httpResponse.EnsureSuccessStatusCode();

            string response = await httpResponse.Content.ReadAsStringAsync();
            PaginationResponse<UserVM> responseData = JsonConvert.DeserializeObject<PaginationResponse<UserVM>>(response);

            Assert.True(responseData.Status);
            Assert.Equal("S", responseData.Code);
            Assert.Equal("Retrieve Data is Success!", responseData.Message);
        }

        [Fact]
        public async void TestErrorGetData()
        {
            HttpResponseMessage httpResponse = await _client.GetAsync("/api/user?page=0&size=10");

            httpResponse.EnsureSuccessStatusCode();

            string response = await httpResponse.Content.ReadAsStringAsync();
            PaginationResponse<UserVM> responseData = JsonConvert.DeserializeObject<PaginationResponse<UserVM>>(response);

            Assert.False(responseData.Status);
            Assert.Equal("E-002", responseData.Code);
            Assert.Equal(
                "The value of page and size must be higher than zero!",
                responseData.Message);
        }
    }
}
