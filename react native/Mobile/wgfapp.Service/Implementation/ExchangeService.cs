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
    public class ExchangeService : BaseAPIService, IExchangeService
    {
        private readonly IConfig _config;

        public ExchangeService(IConfig config) : base(config)
        {
            _config = config;
        }

        public async Task<List<ExchangeHistory>> ExchangeHistory(int teamId, string token, CancellationToken cancellationToken = default)
        {
            var exchangeHistory = await GetRequest<List<ExchangeHistory>>($"api/Exchange/ExchangeHistory/{teamId}", token, null, cancellationToken);
            return exchangeHistory;
        }

        public async Task<List<ExchangeInbox>> ExchangeInbox(int teamId, string token, CancellationToken cancellationToken = default)
        {
            var exchangeInbox = await GetRequest<List<ExchangeInbox>>($"api/Exchange/ExchangeInbox/{teamId}", token, null, cancellationToken);
            return exchangeInbox;
        }

        public async Task<List<ExchangePlayList>> ExchangePlayList(int teamId, string token, CancellationToken cancellationToken = default)
        {
            var exchangePlayList = await GetRequest<List<ExchangePlayList>>($"api/Exchange/ExchangePlayList/{teamId}", token, null, cancellationToken);
            return exchangePlayList;
        }
    }
}
