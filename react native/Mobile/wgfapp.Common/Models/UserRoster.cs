using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class UserRoster : BaseUserInfo
    {
        [JsonProperty("teamRole")]
        public int? TeamRole { get; set; }

        [JsonProperty("firstName")] 
        public string FirstName { get; set; }

        [JsonProperty("lastName")] 
        public string LastName { get; set; }

        [JsonProperty("fullName")] 
        public string FullName { get; set; }

        [JsonProperty("email")] 
        public string Email { get; set; }

    }

}

