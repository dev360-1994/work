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
    public class Team : BaseUserInfo
    {
        [JsonProperty("teamName")]
        public string TeamName { get; set; }

        [JsonProperty("defaultTeam")]
        public int DefaultTeam { get; set; }

        [JsonProperty("teamRole")]
        public int TeamRole { get; set; }

        [JsonProperty("productLevel")]
        public int ProductLevel { get; set; }

        [JsonProperty("addOnCamp")]
        public int AddOnCamp { get; set; }

        [JsonProperty("addOnRoku")]
        public int AddOnRoku { get; set; }

        [JsonProperty("teamStatus")]
        public string TeamStatus { get; set; }

        [JsonProperty("teamGuid")]
        public string TeamGuid { get; set; }

        [JsonProperty("teamColor")]
        public string TeamColor { get; set; }
    }
}
