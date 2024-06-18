using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using wgfapp.Common.Models;

namespace wgfapp.Service.Interfaces
{
    public interface IUploadFilmService
    {
        Task<bool> UploadFilm(UploadChunks uploadChunks, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<string>> GetUploadFilms(string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<string>> ValidateHudlUrl(string hudlUrl, string token, CancellationToken cancellationToken = default(CancellationToken)); //StatusCode - 400
        Task<ApiBaseResponse<string>> DownloadHudlUrl(string hudlUrl, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<string>> UploadChunks(Chunk chunk, string token, CancellationToken cancellationToken = default(CancellationToken));
    }
}
