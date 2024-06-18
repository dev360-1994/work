using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class AuthenticationModel
    {
        [JsonProperty("clientId")]
        public string ClientId { get; set; }

        [JsonProperty("clientSecret")]
        public string ClientSecret { get; set; }
    }
}
