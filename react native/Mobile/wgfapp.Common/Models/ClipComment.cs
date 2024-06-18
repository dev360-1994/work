using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
namespace wgfapp.Common.Models
{
    public class ClipComment : BaseUserInfo
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        
        [JsonProperty("clipId")]
        public int ClipId { get; set; }

        [JsonProperty("timePoint")] 
        public decimal TimePoint { get; set; }
        
        [JsonProperty("comment")] 
        public string Comment { get; set; }
    }

}

