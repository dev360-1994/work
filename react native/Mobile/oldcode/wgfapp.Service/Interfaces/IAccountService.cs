using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using wgfapp.Common.Models;

namespace wgfapp.Service.Interfaces
{
    public interface IAccountService
    {
        Task<VersionModel> GetVersion(string deviceName, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<string> GetServerTime(string token, CancellationToken cancellationToken = default(CancellationToken));
    }
}
