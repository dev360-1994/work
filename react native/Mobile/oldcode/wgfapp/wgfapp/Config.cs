using System;
using wgfapp.Common.Interfaces;

namespace wgfapp
{
    public class Config : IConfig
    {
        public string ClientId { get { return "52F6CB5F-882C-4EFA-A5AE-6ACDA2F88D41"; } }

        public string ClientSecret { get { return "DFB6CC32-F375-4C44-B262-61188BB8A96E"; } }

        public string BaseUrl { get { return "https://wgfapi20201109202758.azurewebsites.net"; } }

        public int TimeoutInMilliseconds { get { return 90000; } } // 90 Seconds

        public string APIKey { get { return "API Key goes here"; } }
    }
}
