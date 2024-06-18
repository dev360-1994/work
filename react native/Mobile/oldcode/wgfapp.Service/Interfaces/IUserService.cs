using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using wgfapp.Common.Models;

namespace wgfapp.Service.Interfaces
{
    public interface IUserService
    {
        Task<IList<UserHistory>> GetUserHistory(BaseUserInfo baseUserIfo, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<UserProfile> GetUserProfile(BaseUserInfo baseUserInfo, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<string>> UpdateUserProfile(UserProfile requestUserProfileModel, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<UserProfile>> LeaveTeam(BaseUserInfo baseUserInfo, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<string>> UpdateUserPassword(ChangePassword requestUserProfileModel, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<IList<UserRoles>> GetUserRoles(string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<IList<UsersTeam>> GetUserTeams(int userId, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<IList<TeamUser>> GetTeamUsers(int teamId, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<string>> DeleteTeamUser(TeamUser teamUser, string token, CancellationToken cancellationToken = default(CancellationToken));//StatusCode - 500
        Task<ApiBaseResponse<bool>> AddTeamUser(TeamUser teamUser, string token, CancellationToken cancellationToken = default(CancellationToken));//StatusCode - 500
        Task<ApiBaseResponse<bool>> UpdateTeamUser(TeamUser teamUser, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<bool>> ResendInvite(ResendInvite resendInvite, string token, CancellationToken cancellationToken = default(CancellationToken));
    }
}
