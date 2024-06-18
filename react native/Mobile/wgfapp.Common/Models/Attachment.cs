using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class Attachment : BaseUserInfo
    {
       
        [JsonProperty("clipId")]
        public int ClipId { get; set; }

        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("timepoint")]
        public int TimePoint { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("guid")]
        public string Guid { get; set; }

        [JsonProperty("path")]
        public string Path { get; set; }

        [JsonProperty("created")]
        public string Created { get; set; }

        [JsonProperty("updated")]
        public string Updated { get; set; }
    }
}
