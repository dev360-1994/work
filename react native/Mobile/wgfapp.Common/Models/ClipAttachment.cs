using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;


namespace wgfapp.Common.Models
{
    public class ClipAttachment : BaseUserInfo
    {
        [JsonProperty("id")]
        public int Id { get; set; }
       
        [JsonProperty("clipId")]
        public int ClipId { get; set; }
        
        [JsonProperty("timePoint")]
        public decimal TimePoint { get; set; }
        
        [JsonProperty("type")]
        public string Type { get; set; }
        
        [JsonProperty("guid")]
        public string Guid { get; set; }
       
        [JsonProperty("path")]
        public string Path { get; set; }
       
        [JsonProperty("created")]
        public DateTime Created { get; set; }
        
        [JsonProperty("updated")]
        public DateTime Updated { get; set; }
    }

}

