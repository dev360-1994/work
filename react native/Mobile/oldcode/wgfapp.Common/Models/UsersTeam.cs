using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class UsersTeam : BaseUserInfo
    {
        [JsonProperty("teamName")]
        public string TeamName { get; set; }

        [JsonProperty("defaultTeam")]
        public int DefaultTeam { get; set; }
    }
}
