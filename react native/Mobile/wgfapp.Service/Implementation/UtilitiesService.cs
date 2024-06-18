using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using wgfapp.Common.Interfaces;
using wgfapp.Common.Models;
using wgfapp.Service.Interfaces;

namespace wgfapp.Service.Implementation
{
    public class UtilitiesService : BaseAPIService, IUtilitiesService
    {
        private readonly IConfig _config;

        public UtilitiesService(IConfig config) : base(config)
        {
            _config = config;
        }

        //Return false
        public async Task<ApiBaseResponse<bool>> UpdateUploadTransferAddress(TransferAddress transferAddress, string token, CancellationToken cancellationToken = default)
        {
            IDictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("server", transferAddress.Server);
            parameters.Add("url", transferAddress.Url);
            parameters.Add("file", transferAddress.File);
            parameters.Add("key", transferAddress.Key);

            var transferAddressResponse = await PostRequest("api/Utilities/UpdateUploadTransferAddress", null, token, parameters, null, cancellationToken);
            return new ApiBaseResponse<bool>()
            {
                Status = transferAddressResponse.StatusCode,
                Message = transferAddressResponse.StatusCode != System.Net.HttpStatusCode.OK ? transferAddressResponse.Content.ToString() : "Transfer address update successfully",
                Data = transferAddressResponse.StatusCode == System.Net.HttpStatusCode.OK,
            };
        }

        //Return false
        public async Task<ApiBaseResponse<bool>> UpdateUploadTransferFileSize(TransferFileSize transferFileSize, string token, CancellationToken cancellationToken = default)
        {
            IDictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("size", transferFileSize.Size);
            parameters.Add("key", transferFileSize.Key);

            var transferFileResponse = await PostRequest("api/Utilities/UpdateUploadTransferFilesize", null, token, parameters, null, cancellationToken);
            return new ApiBaseResponse<bool>()
            {
                Status = transferFileResponse.StatusCode,
                Message = transferFileResponse.StatusCode != System.Net.HttpStatusCode.OK ? transferFileResponse.Content.ToString() : "Transfer filesize update successfully",
                Data = transferFileResponse.StatusCode == System.Net.HttpStatusCode.OK,
            };
        }
    }
    
}
