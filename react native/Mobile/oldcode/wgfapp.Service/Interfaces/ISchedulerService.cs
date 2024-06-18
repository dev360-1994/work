using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using wgfapp.Common.Models;

namespace wgfapp.Service.Interfaces
{
    public interface ISchedulerService
    {
        Task<List<Appointment>> GetAppointments(Appointment appointment, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<string>> UpdateAppointment(Appointment appointment, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<string>> AddAppointment(Appointment appointment, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<string>> DeleteAppointment(Appointment appointment, string token, CancellationToken cancellationToken = default(CancellationToken));
    }
}
