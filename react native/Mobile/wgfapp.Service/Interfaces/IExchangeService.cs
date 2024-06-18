using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using wgfapp.Common.Models;

namespace wgfapp.Service.Interfaces
{
    public interface IExchangeService
    {
        Task<List<ExchangePlayList>> ExchangePlayList(int teamId, string token, CancellationToken cancellationToken = default(CancellationToken));

        Task<List<ExchangeInbox>> ExchangeInbox(int teamId, string token, CancellationToken cancellationToken = default(CancellationToken));

        Task<List<ExchangeHistory>> ExchangeHistory(int teamId, string token, CancellationToken cancellationToken = default(CancellationToken));
    }
}
