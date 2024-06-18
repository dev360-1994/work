using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class UserProfile
    {
        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("userId")]
        public int UserId { get; set; }

        [JsonProperty("firstName")]
        public string FirstName { get; set; }

        [JsonProperty("lastName")]
        public string LastName { get; set; }

        [JsonProperty("prefference")]
        public int Prefference { get; set; }

        [JsonProperty("dnc")]
        public int Dnc { get; set; }

        [JsonProperty("userPassword")]
        public string UserPassword { get; set; }

        [JsonProperty("phone")]
        public string Phone { get; set; }

        [JsonProperty("owner")]
        public int Owner { get; set; }
    }
}
