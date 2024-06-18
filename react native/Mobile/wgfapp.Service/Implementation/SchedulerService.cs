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
    public class SchedulerService : BaseAPIService, ISchedulerService
    {
        private readonly IConfig _config;

        public SchedulerService(IConfig config) : base(config)
        {
            _config = config;
        }

        public async Task<ApiBaseResponse<string>> AddAppointment(Appointment appointment, string token, CancellationToken cancellationToken = default)
        {
            var addAppointment = await PostRequest("api/Scheduler/Appointment", appointment, token, null, null, cancellationToken);

            try
            {
                return new ApiBaseResponse<string>() { Status = addAppointment.StatusCode, Message = "Added successfully", Data = null };
            }
            catch (JsonSerializationException ex)
            {
                ErrorResponse errorResponse = JsonConvert.DeserializeObject<ErrorResponse>(addAppointment.Content);
                return new ApiBaseResponse<string>() { Status = System.Net.HttpStatusCode.NoContent, Message = errorResponse.Message, Data = null };
            }
            catch (Exception ex)
            {
                return new ApiBaseResponse<string>() { Status = System.Net.HttpStatusCode.NoContent, Message = "Could not add appointment", Data = null };
            }
        }

        public async Task<ApiBaseResponse<string>> DeleteAppointment(Appointment appointment, string token, CancellationToken cancellationToken = default)
        {
            var deleteAppointment = await DeleteRequest($"api/Scheduler/AppointmentDelete/{appointment.UniqueId}/{appointment.TeamId}/{appointment.UserId}", token, null, cancellationToken);

            try
            {
                return new ApiBaseResponse<string>() { Status = deleteAppointment.StatusCode, Message = "Delete successfully", Data =null };
                
            }
            catch (JsonSerializationException ex)
            {
                ErrorResponse errorResponse = JsonConvert.DeserializeObject<ErrorResponse>(deleteAppointment.Content);
                return new ApiBaseResponse<string>() { Status = System.Net.HttpStatusCode.NoContent, Message = errorResponse.Message, Data = null };
            }
            catch (Exception ex)
            {
                return new ApiBaseResponse<string>() { Status = System.Net.HttpStatusCode.NoContent, Message = "Could not delete appointment", Data = null };

            }
        }

        public async Task<List<Appointment>> GetAppointments(Appointment appointment, string token, CancellationToken cancellationToken = default)
        {
            var getAppointments = await GetRequest<List<Appointment>>($"/api/Scheduler/Appointment/{appointment.TeamId}/{appointment.UserId}/{appointment.RoleId}", token, null, cancellationToken);
            return getAppointments;
        }

        public async Task<ApiBaseResponse<string>> UpdateAppointment(Appointment appointment, string token, CancellationToken cancellationToken = default)
        {
            var updateAppointment = await PutRequest("api/Scheduler/Appointment", appointment, token, null, cancellationToken);

            try
            {
                return new ApiBaseResponse<string>() { Status = updateAppointment.StatusCode, Message = "Update successfully", Data = null };
            }
            catch (JsonSerializationException ex)
            {
                ErrorResponse errorResponse = JsonConvert.DeserializeObject<ErrorResponse>(updateAppointment.Content);
                return new ApiBaseResponse<string>() { Status = System.Net.HttpStatusCode.NoContent, Message = errorResponse.Message, Data = null };
            }
            catch (Exception ex)
            {
                return new ApiBaseResponse<string>() { Status = System.Net.HttpStatusCode.NoContent, Message = "Could not update appointment", Data = null };
            }
        }
    }
}
