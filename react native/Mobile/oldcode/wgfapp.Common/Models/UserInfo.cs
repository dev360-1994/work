using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class UserInfo : BaseUserInfo
    {
        [JsonProperty("firstName")]
        public string FirstName { get; set; }

        [JsonProperty("lastName")]
        public string LastName { get; set; }

        [JsonProperty("teamName")]
        public string TeamName { get; set; }

        [JsonProperty("teamguid")]
        public string TeamGuid { get; set; }

        [JsonProperty("userRole")]
        public int UserRole { get; set; }

        [JsonProperty("teamStatus")]
        public string TeamStatus { get; set; }
    }
}
