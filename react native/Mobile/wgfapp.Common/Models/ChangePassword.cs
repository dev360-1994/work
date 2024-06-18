using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class ChangePassword : BaseUserInfo
    {
        [JsonProperty("oldPassword")]
        public string OldPassword { get; set; }

        [JsonProperty("newPassword")]
        public string NewPassword { get; set; }
    }
}
