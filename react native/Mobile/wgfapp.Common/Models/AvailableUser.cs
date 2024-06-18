using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
namespace wgfapp.Common.Models
{
    public class AvailableUser : BaseUserInfo
    {
        [JsonProperty("teamRole")]
        public int TeamRole { get; set; }

        [JsonProperty("users")] 
        public int Users { get; set; }
        
        [JsonProperty("text")] 
        public string Text { get; set; }
    }

}

