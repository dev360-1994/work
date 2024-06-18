using System;
using System.Threading;
using System.Threading.Tasks;
using wgfapp.Common.Models;

namespace wgfapp.Service.Interfaces
{
    public interface IUtilitiesService
    {
        
        Task<ApiBaseResponse<bool>> UpdateUploadTransferAddress(TransferAddress transferAddress, string token, CancellationToken cancellationToken = default(CancellationToken));//Return false
        Task<ApiBaseResponse<bool>> UpdateUploadTransferFileSize(TransferFileSize transferFileSize, string token, CancellationToken cancellationToken = default(CancellationToken));//Return false
    }
}
