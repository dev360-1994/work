using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace wgfapp.Common.Models
{
    public class VersionModel
    {
        [JsonProperty("deviceName")]
        public string DeviceName { get; set; }

        [JsonProperty("versionName")]
        public string VersionName { get; set; }

        [JsonProperty("versionCode")]
        public string VersionCode { get; set; }
    }
}
