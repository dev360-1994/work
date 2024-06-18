using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class Comments : BaseUserInfo
    {
        [JsonProperty("id")]
        public int Id { get; set; }
       
        [JsonProperty("clipId")]
        public int ClipId { get; set; }

        [JsonProperty("timePoint")]
        public double TimePoint { get; set; }

        [JsonProperty("comment")]
        public string Comment { get; set; }
    }
}
