using System;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using wgfapp.Common.Interfaces;
using wgfapp.Common.Models;
using wgfapp.Service.Interfaces;

namespace wgfapp.Service.Implementation
{
    public class FileService : BaseAPIService, IFileService
    {
        private readonly IConfig _config;

        public FileService(IConfig config) : base(config)
        {
            _config = config;
        }

        //StatusCode = 204
        public async Task<ApiBaseResponse<string>> GetPath(FilePath filePath, string token, CancellationToken cancellationToken = default)
        {
            var getPath = await GetRequest($"api/File/GetPath/{filePath.TeamId}/{ filePath.UserId}/{filePath.FileType}", token, null, cancellationToken);

            try
            {
                ErrorResponse errorResponse = JsonConvert.DeserializeObject<ErrorResponse>(getPath.Content);
                return new ApiBaseResponse<string>() { Status = System.Net.HttpStatusCode.NoContent, Message = errorResponse.Message, Data = null };
            }
            catch (JsonSerializationException ex)
            {
                return new ApiBaseResponse<string>() { Status = getPath.StatusCode, Message = "File path get successfully", Data = JsonConvert.DeserializeObject<string>(getPath.Content) };
            }
            catch (Exception ex)
            {
                return new ApiBaseResponse<string>() { Status = System.Net.HttpStatusCode.NoContent, Message = "Can not get file path", Data = null };

            }
        }
    }
}
