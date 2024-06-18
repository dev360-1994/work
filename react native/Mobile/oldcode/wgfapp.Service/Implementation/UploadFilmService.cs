using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using wgfapp.Common.Interfaces;
using wgfapp.Common.Models;
using wgfapp.Service.Interfaces;

namespace wgfapp.Service.Implementation
{
    public class UploadFilmService : BaseAPIService, IUploadFilmService
    {
        private readonly IConfig _config;

        public UploadFilmService(IConfig config) : base(config)
        {
            _config = config;
        }

        public async Task<ApiBaseResponse<string>> DownloadHudlUrl(string hudlUrl, string token, CancellationToken cancellationToken = default)
        {
            IDictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("hudlUrl", hudlUrl);


            var downloadHudlUrl = await PostRequest("api/UploadFilm/DownloadHudl", null, token, parameters, null, cancellationToken);
            return new ApiBaseResponse<string>()
            {
                Status = downloadHudlUrl.StatusCode,
                Message = downloadHudlUrl.StatusCode != System.Net.HttpStatusCode.OK ? downloadHudlUrl.Content.ToString() : "Hudl url downloaded successfully",
            };
        }

        public async Task<ApiBaseResponse<string>> GetUploadFilms(string token, CancellationToken cancellationToken = default)
        {
            var getFilms = await GetRequest("api/UploadFilm/Get", token, null, cancellationToken);

            try
            {
                ErrorResponse errorResponse = JsonConvert.DeserializeObject<ErrorResponse>(getFilms.Content);
                return new ApiBaseResponse<string>() { Status = System.Net.HttpStatusCode.NoContent, Message = errorResponse.Message, Data = null };
            }
            catch (JsonSerializationException ex)
            {
                return new ApiBaseResponse<string>() { Status = getFilms.StatusCode, Message = "Films get successfully", Data = JsonConvert.DeserializeObject<string>(getFilms.Content) };
            }
            catch (Exception ex)
            {
                return new ApiBaseResponse<string>() { Status = System.Net.HttpStatusCode.NoContent, Message = "There are no films found", Data = null };

            }
        }

        public async Task<ApiBaseResponse<string>> UploadChunks(Chunk chunk, string token, CancellationToken cancellationToken = default)
        {
            var uploadChunk = await MultipartPostRequest("api/UploadFilm/UploadChunks", chunk, token, null, null, cancellationToken);
            return new ApiBaseResponse<string>()
            {
                Status = uploadChunk.StatusCode,
                Message = uploadChunk.StatusCode != System.Net.HttpStatusCode.OK ? uploadChunk.Content.ToString() : "Uploaded chunk successfully",
            };
        }

        
        public async Task<bool> UploadFilm(UploadChunks uploadChunks, string token, CancellationToken cancellationToken = default)
        {

            IDictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("file", uploadChunks.file);
            parameters.Add("chunkMetadata", uploadChunks.uploadFile.FileName);

            var uploadFilm = await PostRequest<bool>("api/UploadFilm/UploadChunks", uploadChunks, token, cancellationToken);
            return uploadFilm;
        }

        //StatusCode - 400
        public async Task<ApiBaseResponse<string>> ValidateHudlUrl(string hudlUrl, string token, CancellationToken cancellationToken = default)
        {
            IDictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("hudlUrl", hudlUrl);

            var validateHudlUrlResponse = await PostRequest("api/UploadFilm/ValidateHudlUrl", null, token, parameters, null, cancellationToken);
            return new ApiBaseResponse<string>()
            {
                Status = validateHudlUrlResponse.StatusCode,
                Message = validateHudlUrlResponse.StatusCode != System.Net.HttpStatusCode.OK ? validateHudlUrlResponse.Content.ToString() : "Validate hudl url successfully",
            };
        }
    }
}
