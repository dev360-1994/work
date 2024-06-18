using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using wgfapp.Common.Models;

namespace wgfapp.Service
{
    public interface IAuthenticationService
    {
        Task<AuthenticationResponse> Authenticate(AuthenticationModel authenticationModel, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<UserInfo>> Login(LoginModel loginModel, string token, CancellationToken cancellationToken = default(CancellationToken));
    }
}
