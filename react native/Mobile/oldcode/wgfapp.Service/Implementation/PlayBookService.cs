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
    public class PlayBookService : BaseAPIService, IPlayBookService
    {
        private readonly IConfig _config;

        public PlayBookService(IConfig config) : base(config)
        {
            _config = config;
        }

        public async Task<ApiBaseResponse<List<Playbook>>> GetPlaybookList(int teamId, string token, CancellationToken cancellationToken = default)
        {
            var playBooks = await GetRequest($"api/Playbook/PlaybookList/{teamId}", token, null, cancellationToken);
            try
            {
                ErrorResponse errorResponse = JsonConvert.DeserializeObject<ErrorResponse>(playBooks.Content);
                return new ApiBaseResponse<List<Playbook>>() { Status = System.Net.HttpStatusCode.BadRequest, Message = errorResponse.Message, Data = null };
            }
            catch (JsonSerializationException ex)
            {
                return new ApiBaseResponse<List<Playbook>>() { Status = playBooks.StatusCode, Message = "Playbooks get successfully", Data = JsonConvert.DeserializeObject<List<Playbook>>(playBooks.Content) };
            }
        }


        public async Task<ApiBaseResponse<string>> RenamePlaybook(RenamePlaybook renamePlaybook, string token, CancellationToken cancellationToken = default)
        {
            var renamePlaybookResponse = await PostRequest("api/Playbook/PlaybookRename", renamePlaybook, token, null, null, cancellationToken);
            try
            {
                ErrorResponse errorResponse = JsonConvert.DeserializeObject<ErrorResponse>(renamePlaybookResponse.Content);
                return new ApiBaseResponse<string>() { Status = System.Net.HttpStatusCode.BadRequest, Message = errorResponse.Message, Data = null };
            }
            catch (JsonSerializationException ex)
            {
                return new ApiBaseResponse<string>() { Status = renamePlaybookResponse.StatusCode, Message = "Playbook rename successfully", Data = JsonConvert.DeserializeObject<string>(renamePlaybookResponse.Content) };
            }
        }

        public async Task<ApiBaseResponse<string>> DeletePlaybook(Playbook deletePlaybook, string token, CancellationToken cancellationToken = default)
        {
            var deletePlaybookResponse = await DeleteRequest($"api/Playbook/PlaybookDelete/{deletePlaybook.TeamId}/{deletePlaybook.UserId}/{deletePlaybook.PlaybookId}", token, null, cancellationToken);
            try
            {
                ErrorResponse errorResponse = JsonConvert.DeserializeObject<ErrorResponse>(deletePlaybookResponse.Content);
                return new ApiBaseResponse<string>() { Status = System.Net.HttpStatusCode.BadRequest, Message = errorResponse.Message, Data = null };
            }
            catch (JsonSerializationException ex)
            {
                return new ApiBaseResponse<string>() { Status = deletePlaybookResponse.StatusCode, Message = "Playbook delete successfully", Data = JsonConvert.DeserializeObject<string>(deletePlaybookResponse.Content) };
            }
        }


        public async Task<ApiBaseResponse<string>> UpdatePlaybookPage(PlaybookPage playbookPage, string token, CancellationToken cancellationToken = default)
        {
            var updatePlaybookPage = await PutRequest("api/Playbook/PlaybookPage", playbookPage, token, null, cancellationToken);
            try
            {
                ErrorResponse errorResponse = JsonConvert.DeserializeObject<ErrorResponse>(updatePlaybookPage.Content);
                return new ApiBaseResponse<string>() { Status = System.Net.HttpStatusCode.BadRequest, Message = errorResponse.Message, Data = null };
            }
            catch (JsonSerializationException ex)
            {
                return new ApiBaseResponse<string>() { Status = updatePlaybookPage.StatusCode, Message = "Update playbook page successfully", Data = JsonConvert.DeserializeObject<string>(updatePlaybookPage.Content) };
            }
        }

        public async Task<Playbook> GetPlaybook(Playbook requestPlayBook, string token, CancellationToken cancellationToken = default)
        {
            var playBook = await GetRequest<Playbook>($"api/Playbook/{requestPlayBook.TeamId}/{requestPlayBook.PlaybookId}", token, null, cancellationToken);
            return playBook;
        }

        public async Task<ApiBaseResponse<string>> SavePlaybook(Playbook savePlaybook, string token, CancellationToken cancellationToken = default)
        {
            var savePlaybookResponse = await PostRequest("api/Playbook", savePlaybook, token, null, null, cancellationToken);
            try
            {
                ErrorResponse errorResponse = JsonConvert.DeserializeObject<ErrorResponse>(savePlaybookResponse.Content);
                return new ApiBaseResponse<string>() { Status = System.Net.HttpStatusCode.BadRequest, Message = errorResponse.Message, Data = null };
            }
            catch (JsonSerializationException ex)
            {
                return new ApiBaseResponse<string>() { Status = savePlaybookResponse.StatusCode, Message = "Playbook saved successfully", Data = JsonConvert.DeserializeObject<string>(savePlaybookResponse.Content) };
            }
        }

        public async Task<List<PlaybookPage>> GetPlaybookPage(Playbook playbook, string token, CancellationToken cancellationToken = default)
        {
            var playbookPages = await GetRequest<List<PlaybookPage>>($"api/Playbook/PlaybookPage/{playbook.PlaybookId}/{playbook.TeamId}", token, null, cancellationToken);

            return playbookPages;
        }
    }
}
