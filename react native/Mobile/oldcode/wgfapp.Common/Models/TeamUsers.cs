using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class TeamUser : BaseUserInfo
    {
        [JsonProperty("addUserId")]
        public int AddUserId { get; set; }

        [JsonProperty("fullName")]
        public string FullName { get; set; }

        [JsonProperty("firstName")]
        public string FirstName { get; set; }

        [JsonProperty("lastName")]
        public string LastName { get; set; }

        [JsonProperty("emailAddress")]
        public string EmailAddress { get; set; }

        [JsonProperty("smsNumber")]
        public double SmsNumber { get; set; }

        [JsonProperty("teamRole")]
        public int TeamRole { get; set; }

        [JsonProperty("dateExpired")]
        public DateTime? DateExpired { get; set; }

        [JsonProperty("userPassword")]
        public string UserPassword { get; set; }
    }
}
