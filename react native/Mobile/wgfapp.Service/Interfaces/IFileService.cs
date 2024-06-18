using System;
using System.Threading;
using System.Threading.Tasks;
using wgfapp.Common.Models;

namespace wgfapp.Service.Interfaces
{
    public interface IFileService
    {
        Task<ApiBaseResponse<string>> GetPath(FilePath filePath, string token, CancellationToken cancellationToken = default(CancellationToken)); //StatusCode = 204
    }
}
