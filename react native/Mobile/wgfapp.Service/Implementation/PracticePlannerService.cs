using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using wgfapp.Common.Interfaces;
using wgfapp.Common.Models;
using wgfapp.Service.Interfaces;

namespace wgfapp.Service.Implementation
{
    public class PracticePlannerService : BaseAPIService, IPracticePlannerService
    {
        private readonly IConfig _config;

        public PracticePlannerService(IConfig config) : base(config)
        {
            _config = config;
        }

        public async Task<ApiBaseResponse<string>> DeletePracticePlanner(PracticePlanner deletePlanner, string token, CancellationToken cancellationToken = default)
        {
            var deletePraticePlanner = await DeleteRequest($"api/Practice/PracticePlanDelete/{deletePlanner.TeamId}/{deletePlanner.UserId}/{deletePlanner.PracticeDate:MM-dd-yyyy}", token, null, cancellationToken);
            return new ApiBaseResponse<string>()
            {
                Status = deletePraticePlanner.StatusCode,
                Message = deletePraticePlanner.StatusCode != System.Net.HttpStatusCode.OK ? deletePraticePlanner.Content.ToString() : "Deleted Successfully",
            };
        }

        public async Task<ApiBaseResponse<string>> GetPracticePlanner(RequestPracticePlanModel requestPracticePlanModel, string token, CancellationToken cancellationToken = default)
        {
            IDictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("teamId", requestPracticePlanModel.TeamId);
            parameters.Add("practiceDate", requestPracticePlanModel.PracticeDate);

            var praticePlanner = await GetRequest("api/Practice/PracticePlan", token, parameters, cancellationToken);

            try
            {
                ErrorResponse errorResponse = JsonConvert.DeserializeObject<ErrorResponse>(praticePlanner.Content);
                return new ApiBaseResponse<string>() { Status = System.Net.HttpStatusCode.NoContent, Message = errorResponse.Message, Data = null };
            }
            catch (JsonSerializationException ex)
            {
                return new ApiBaseResponse<string>() { Status = praticePlanner.StatusCode, Message = "Plan get successfully", Data = JsonConvert.DeserializeObject<string>(praticePlanner.Content) };
            }
            catch (Exception ex)
            {
                return new ApiBaseResponse<string>() { Status = System.Net.HttpStatusCode.NoContent, Message = "There are no plan found", Data = null };

            }
        }

        public async Task<List<PracticeLibrary>> GetPracticeLibrary(string token, CancellationToken cancellationToken = default)
        {
            var praticeLibrary = await GetRequest<List<PracticeLibrary>>("api/Practice/PracticeLibrary", token, null, cancellationToken);
            return praticeLibrary;
        }

        public async Task<ApiBaseResponse<string>> InsertPracticePlanner(PracticePlanner requestInsertPracticePlan, string token, CancellationToken cancellationToken = default)
        {
            var insertPlan = await PostRequest("api/Practice/PracticePlanInsert", requestInsertPracticePlan, token, null, null, cancellationToken);
            return new ApiBaseResponse<string>()
            {
                Status = insertPlan.StatusCode,
                Message = insertPlan.StatusCode != System.Net.HttpStatusCode.OK ? insertPlan.Content.ToString() : "Insert Successfully",
            };
        }

        public async Task<ApiBaseResponse<string>> UpdatePraticeTamplate(RequestTemplateUpdate requestTemplateUpdate, string token, CancellationToken cancellationToken = default)
        {
            var updatePracticeTemplate = await PutRequest("api/Practice/PracticeTemplateUpdate", requestTemplateUpdate, token, null, cancellationToken);
            return new ApiBaseResponse<string>()
            {
                Status = updatePracticeTemplate.StatusCode,
                Message = updatePracticeTemplate.StatusCode != System.Net.HttpStatusCode.OK ? updatePracticeTemplate.Content.ToString() : "Update Successfully",
            };
        }

        public async Task<ApiBaseResponse<string>> UpdatePracticePlanner(PracticePlanner requestInsertPracticePlan, string token, CancellationToken cancellationToken = default)
        {
            var updatePracticePlan = await PutRequest("api/Practice/PracticePlanUpdate", requestInsertPracticePlan, token, null, cancellationToken);
            return new ApiBaseResponse<string>()
            {
                Status = updatePracticePlan.StatusCode,
                Message = updatePracticePlan.StatusCode != System.Net.HttpStatusCode.OK ? updatePracticePlan.Content.ToString() : "Update Successfully",
            };
        }


        public async Task<ApiBaseResponse<string>> UpdatePraticeLibraryTamplate(RequestPracticeLibraryUpdate requestPracticeLibraryUpdate, string token, CancellationToken cancellationToken = default)
        {
            IDictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("teamId", requestPracticeLibraryUpdate.TeamId);
            parameters.Add("userId", requestPracticeLibraryUpdate.UserId);
            parameters.Add("templateId", requestPracticeLibraryUpdate.TemplateId);

            var updatePracticeLibrary= await PutRequest($"api/Practice/PracticeLibraryUpdate?teamId={requestPracticeLibraryUpdate.TeamId}&userId={requestPracticeLibraryUpdate.UserId}&templateId={requestPracticeLibraryUpdate.TemplateId}", null, token, null, cancellationToken);
            return new ApiBaseResponse<string>()
            {
                Status = updatePracticeLibrary.StatusCode,
                Message = updatePracticeLibrary.StatusCode != System.Net.HttpStatusCode.OK ? updatePracticeLibrary.Content.ToString() : "Update Successfully",
            };
        }

        public async Task<ApiBaseResponse<string>> GetPracticeTemplate(RequestPracticePlanModel requestPracticePlanModel, string token, CancellationToken cancellationToken = default)
        {
           
            var praticeTemplate = await GetRequest($"api/Practice/PracticeTemplate/{requestPracticePlanModel.TeamId}", token, null, cancellationToken);
            try
            {
                ErrorResponse errorResponse = JsonConvert.DeserializeObject<ErrorResponse>(praticeTemplate.Content);
                return new ApiBaseResponse<string>() { Status = System.Net.HttpStatusCode.BadRequest, Message = errorResponse.Message, Data = null };
            }
            catch (JsonSerializationException ex)
            {
                return new ApiBaseResponse<string>() { Status = praticeTemplate.StatusCode, Message = "Template get successfully", Data = JsonConvert.DeserializeObject<string>(praticeTemplate.Content) };
            }
        }
    }
}
