using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using wgfapp.Common.Interfaces;
using wgfapp.Common.Models;
using wgfapp.Service.Interfaces;

namespace wgfapp.Service.Implementation
{
    public class AccountService : BaseAPIService, IAccountService
    {
        private readonly IConfig _config;

        public AccountService(IConfig config) : base(config)
        {
            _config = config;
        }

        public async Task<VersionModel> GetVersion(string deviceName, string token, CancellationToken cancellationToken = default)
        {
            IDictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("deviceName", deviceName);
            var versionResponse = await GetRequest<VersionModel>("api/Account/GetVersion", token, parameters, cancellationToken);
            return versionResponse;
        }

        public async Task<string> GetServerTime(string token, CancellationToken cancellationToken = default)
        {
            var serverTime = await GetRequest<string>("api/Account/GetServerTime", token, null, cancellationToken);
            return serverTime;
        }
    }
}
