using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class AuthenticationResponse
    {
        [JsonProperty("access_Token")]
        public string Token { get; set; }

        [JsonProperty("tokenType")]
        public string TokenType { get; set; }

        [JsonProperty("expires_In")]
        public int ExpiresIn { get; set; }
    }
}
