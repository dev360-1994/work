using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using wgfapp.Common.Models;

namespace wgfapp.Service.Interfaces
{
    public interface ITeamUsersService
    {
        Task<List<UsersTeam>> GetUserteams(int usersId, string token, CancellationToken cancellationToken = default(CancellationToken)); 
    }
}
