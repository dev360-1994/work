using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class TransferAddress
    {
        [JsonProperty("server")]
        public string Server { get; set; }

        [JsonProperty("url")]
        public string Url { get; set; }

        [JsonProperty("file")]
        public string File { get; set; }

        [JsonProperty("key")]
        public string Key { get; set; }
    }
}
