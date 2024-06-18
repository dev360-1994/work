using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using wgfapp.Common.Interfaces;
using wgfapp.Common.Models;
using wgfapp.Service.Interfaces;

namespace wgfapp.Service.Implementation
{
    public class UserService : BaseAPIService, IUserService
    {
        private readonly IConfig _config;

        public UserService(IConfig config) : base(config)
        {
            _config = config;
        }

        //StatusCode - 500
        public async Task<ApiBaseResponse<bool>> AddTeamUser(TeamUser teamUser, string token, CancellationToken cancellationToken = default)
        {
            var addTeamUserResponse = await PostRequest("api/User/TeamUser", teamUser, token, null, null, cancellationToken);
            return new ApiBaseResponse<bool>()
            {
                Status = addTeamUserResponse.StatusCode,
                Message = addTeamUserResponse.StatusCode != System.Net.HttpStatusCode.OK ? addTeamUserResponse.Content.ToString() : "Add successfully",
                Data = addTeamUserResponse.StatusCode == System.Net.HttpStatusCode.OK,
            };
        }


        //StatusCode - 500
        public async Task<ApiBaseResponse<string>> DeleteTeamUser(TeamUser teamUser, string token, CancellationToken cancellationToken = default)
        {
            var deleteTeamUserResponse = await DeleteRequest($"api/User/TeamUser/{teamUser.TeamId}/{teamUser.UserId}/{teamUser.AddUserId}", null, token, cancellationToken);
            return new ApiBaseResponse<string>()
            {
                Status = deleteTeamUserResponse.StatusCode,
                Message = deleteTeamUserResponse.StatusCode != System.Net.HttpStatusCode.OK ? deleteTeamUserResponse.Content.ToString() : "Delete successfully",
            };
        }



        public async Task<IList<TeamUser>> GetTeamUsers(int teamId, string token, CancellationToken cancellationToken)
        {
            var teamUsers = await GetRequest<IList<TeamUser>>($"api/User/TeamUsers/{teamId}", token, null, cancellationToken);
            return teamUsers;
        }

        public async Task<IList<UserHistory>> GetUserHistory(BaseUserInfo baseUserInfo, string token, CancellationToken cancellationToken = default)
        {
            var userHistory = await GetRequest<IList<UserHistory>>($"api/User/History/{baseUserInfo.TeamId}/{baseUserInfo.UserId}", token, null, cancellationToken);
            return userHistory;
        }

        public async Task<UserProfile> GetUserProfile(BaseUserInfo baseUserInfo, string token, CancellationToken cancellationToken = default)
        {
            var getUserProfile = await GetRequest<UserProfile>($"api/User/GetUserProfile/{baseUserInfo.TeamId}/{baseUserInfo.UserId}", token, null, cancellationToken);
            return getUserProfile;
        }

        public async Task<IList<UserRoles>> GetUserRoles(string token, CancellationToken cancellationToken = default)
        {
            var getUserRoles = await GetRequest<IList<UserRoles>>("api/User/GetUserRoles", token, null, cancellationToken);
            return getUserRoles;
        }

        public async Task<IList<UsersTeam>> GetUserTeams(int userId, string token, CancellationToken cancellationToken = default)
        {
            var getUserTeams = await GetRequest<List<UsersTeam>>($"api/User/GetUserTeams/{userId}", token, null, cancellationToken);
            return getUserTeams;
        }

        public async Task<ApiBaseResponse<UserProfile>> LeaveTeam(BaseUserInfo baseUserInfo, string token, CancellationToken cancellationToken = default)
        {
            IDictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("teamId", baseUserInfo.TeamId);
            parameters.Add("userId", baseUserInfo.UserId);

            var leaveTeamResponse = await GetRequest<ApiBaseResponse<UserProfile>>("api/User/LeaveTeam", token, parameters, cancellationToken);

            return leaveTeamResponse;
        }

        public async Task<ApiBaseResponse<bool>> ResendInvite(ResendInvite resendInvite, string token, CancellationToken cancellationToken = default)
        {
            var resendInviteResponse = await PostRequest("api/User/ResendInvite", resendInvite, token, null, null, cancellationToken);
            return new ApiBaseResponse<bool>()
            {
                Status = resendInviteResponse.StatusCode,
                Message = resendInviteResponse.StatusCode != System.Net.HttpStatusCode.OK ? resendInviteResponse.Content.ToString() : "Resend invite Successfully",
                Data = resendInviteResponse.StatusCode == System.Net.HttpStatusCode.OK
            };
        }

        public async Task<ApiBaseResponse<bool>> UpdateTeamUser(TeamUser teamUser, string token, CancellationToken cancellationToken = default)
        {
            var updateTeamUserResponse = await PutRequest("api/User/TeamUser", teamUser, token, null, cancellationToken);
            return new ApiBaseResponse<bool>()
            {
                Status = updateTeamUserResponse.StatusCode,
                Message = updateTeamUserResponse.StatusCode != System.Net.HttpStatusCode.OK ? updateTeamUserResponse.Content.ToString() : "Update successfully",
                Data = updateTeamUserResponse.StatusCode == System.Net.HttpStatusCode.OK,
            };
        }

        public async Task<ApiBaseResponse<string>> UpdateUserPassword(ChangePassword requestUpdatePassword, string token, CancellationToken cancellationToken = default)
        {
            var updateUserPassword = await PutRequest("api/User/UpdatePassword", requestUpdatePassword, token,null, cancellationToken);

            return new ApiBaseResponse<string>()
            {
                Status = updateUserPassword.StatusCode,
                Message = updateUserPassword.StatusCode != System.Net.HttpStatusCode.OK ? updateUserPassword.ErrorMessage : "Password updated Successfully",
            };
        }

        public async Task<ApiBaseResponse<string>> UpdateUserProfile(UserProfile requestUpdateProfile, string token, CancellationToken cancellationToken = default)
        {
            var updateUser = await PutRequest("api/User/UpdateUserProfile", requestUpdateProfile, token, null, cancellationToken);
            return new ApiBaseResponse<string>()
            {
                Status = updateUser.StatusCode,
                Message = updateUser.StatusCode != System.Net.HttpStatusCode.OK ? updateUser.ErrorMessage : "Update Successfully",
            };
        }

        public async Task<Team> GetTeamInfo(int teamId,int userId, string token, CancellationToken cancellationToken = default)
        {
            var getTeamInfo = await GetRequest<Team>($"api/User/TeamInfo/{teamId}/{userId}", token, null, cancellationToken);
            return getTeamInfo;
        }


        public async Task<DashboardAlerts> GetDashboardAlertsStatus(int teamId, int userId, string token, CancellationToken cancellationToken = default)
        {
            var getDashboardAlertsStatus = await GetRequest<DashboardAlerts>($"api/User/status/{teamId}/{userId}", token, null, cancellationToken);
            return getDashboardAlertsStatus;
        }

      
    }
}
