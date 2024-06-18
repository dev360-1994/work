using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class RequestOperationAccess : BaseUserInfo
    {
        [JsonProperty("userRole")]
        public int UserRole { get; set; }
    }
}
