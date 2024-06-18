using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class TransferFileSize
    {
        [JsonProperty("size")]
        public string Size { get; set; }

        [JsonProperty("key")]
        public string Key { get; set; }
    }
}
