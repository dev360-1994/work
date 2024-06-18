using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using wgfapp.Common.Models;

namespace wgfapp.Service.Interfaces
{
    public interface IPlayBookService
    {
        Task<ApiBaseResponse<List<Playbook>>> GetPlaybookList(int teamId, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<string>> RenamePlaybook(RenamePlaybook renamePlaybook, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<string>> DeletePlaybook(Playbook requestPlayBook, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<List<PlaybookPage>> GetPlaybookPage(Playbook playbook, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<string>> UpdatePlaybookPage(PlaybookPage playbookPage, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<Playbook> GetPlaybook(Playbook playbook, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<string>> SavePlaybook(Playbook savePlaybook, string token, CancellationToken cancellationToken = default(CancellationToken));
    }
}
