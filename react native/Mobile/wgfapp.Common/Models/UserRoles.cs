using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class UserRoles
    {
        [JsonProperty("roleId")]
        public int RoleId { get; set; }

        [JsonProperty("roleValue")]
        public string RoleValue { get; set; }
    }
}
