using System;

namespace wgfapp.Common.Interfaces
{
    public interface IConfig
    {
        string ClientId { get; }

        string ClientSecret { get; }

        string BaseUrl { get; }

        int TimeoutInMilliseconds { get; }

        string APIKey { get; }
    }
}
