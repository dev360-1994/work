using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class BaseUserInfo
    {
        [JsonProperty("userId")]
        public int UserId { get; set; }

        [JsonProperty("teamId")]
        public int TeamId { get; set; }
    }
}
