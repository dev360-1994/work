﻿using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using wgfapp.Common.Interfaces;
using wgfapp.Common.Models;

namespace wgfapp.Service
{
    public class AuthenticationService : BaseAPIService, IAuthenticationService
    {
        private readonly IConfig _config;

        public AuthenticationService(IConfig config) : base(config)
        {
            _config = config;
        }

        public async Task<AuthenticationResponse> Authenticate(AuthenticationModel authenticationModel, CancellationToken cancellationToken = default(CancellationToken))
        {
            var authenticationResponse = await PostRequest<AuthenticationResponse>("api/Account/GetToken", authenticationModel, cancellationToken);
            return authenticationResponse;
        }

        public async Task<ApiBaseResponse<UserInfo>> Login(LoginModel loginModel, string token, CancellationToken cancellationToken = default)
        {
            var loginResponse = await PostRequest("api/Account/Login", loginModel, token, null, null, cancellationToken);
            return new ApiBaseResponse<UserInfo>()
            {
                Status = loginResponse.StatusCode,
                Message = loginResponse.StatusCode != System.Net.HttpStatusCode.OK ? loginResponse.Content.ToString() : "Login Successfully",
                Data = JsonConvert.DeserializeObject<UserInfo>(loginResponse.Content.ToString())
            };
        }

        public async Task<ApiBaseResponse<bool>> ForgotPassword(string email)
        {
            var restResponse = await GetRequest($"api/Account/ResetPassword/{email}", null, null);
            return new ApiBaseResponse<bool>()
            {
                Status = restResponse.StatusCode,
                Message = restResponse.StatusCode != System.Net.HttpStatusCode.OK ? "Email does not found." : "Password Reset Email sent your email, Please check your inbox/spam/trash.",
                Data = restResponse.StatusCode == System.Net.HttpStatusCode.OK
            };
        }
    }
}
