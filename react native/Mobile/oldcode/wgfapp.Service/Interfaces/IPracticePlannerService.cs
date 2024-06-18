using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using wgfapp.Common.Models;

namespace wgfapp.Service.Interfaces
{
    public interface IPracticePlannerService
    {
        Task<ApiBaseResponse<string>> GetPracticePlanner(RequestPracticePlanModel requestPracticePlanModel, string token, CancellationToken cancellationToken = default(CancellationToken));

        Task<ApiBaseResponse<string>> GetPracticeTemplate(RequestPracticePlanModel requestPracticePlanModel, string token, CancellationToken cancellationToken = default(CancellationToken));

        Task<ApiBaseResponse<string>> InsertPracticePlanner(PracticePlanner requestInsertPracticePlan, string token, CancellationToken cancellationToken = default(CancellationToken));

        Task<ApiBaseResponse<string>> UpdatePracticePlanner(PracticePlanner requestInsertPracticePlan, string token, CancellationToken cancellationToken = default(CancellationToken));

        Task<ApiBaseResponse<string>> DeletePracticePlanner(PracticePlanner requestInsertPracticePlan, string token, CancellationToken cancellationToken = default(CancellationToken));

        Task<List<PracticeLibrary>> GetPracticeLibrary(string token, CancellationToken cancellationToken = default(CancellationToken));

        Task<ApiBaseResponse<string>> UpdatePraticeLibraryTamplate(RequestPracticeLibraryUpdate requestPracticeLibraryUpdate, string token, CancellationToken cancellationToken = default(CancellationToken));

        Task<ApiBaseResponse<string>> UpdatePraticeTamplate(RequestTemplateUpdate requestPracticeLibraryUpdate, string token, CancellationToken cancellationToken = default(CancellationToken));
    }
}
