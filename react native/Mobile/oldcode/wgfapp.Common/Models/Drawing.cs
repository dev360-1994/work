using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class Drawing : BaseUserInfo
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("content")]
        public string Content { get; set; }

        [JsonProperty("timepoint")]
        public double Timepoint { get; set; }

        [JsonProperty("clipId")]
        public int ClipId { get; set; }
    }
}
