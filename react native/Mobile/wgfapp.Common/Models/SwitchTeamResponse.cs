using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class SwitchTeamResponse : BaseUserInfo
    {
        [JsonProperty("teamRole")]
        public int TeamRole { get; set; }

        [JsonProperty("productLevel")]
        public int ProductLevel { get; set; }

        [JsonProperty("teamguid")]
        public Guid TeamGuid { get; set; }
    }
}
