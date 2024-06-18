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
    public class TeamUsersService : BaseAPIService, ITeamUsersService
    {
        private readonly IConfig _config;

        public TeamUsersService(IConfig config) : base(config)
        {
            _config = config;
        }


        public async Task<List<UsersTeam>> GetUserteams(int usersId, string token, CancellationToken cancellationToken = default)
        {
            IDictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("userId", usersId);

            var usersTeams = await GetRequest<List<UsersTeam>>($"api/TeamUsers/UserTeams/{usersId}", token, null, cancellationToken);
            return usersTeams;
        }

        public async Task<SwitchTeamResponse> SwithTeam(int userId, int teamId, string token, CancellationToken cancellationToken = default(CancellationToken))
        {
            var switchTeamResponse = await GetRequest<SwitchTeamResponse>($"api/TeamUsers/SwitchTeam/{userId}/{teamId}", token, null, cancellationToken);
            return switchTeamResponse;
        }
    }
}
