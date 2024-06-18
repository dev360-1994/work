using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class TagImport:BaseUserInfo
    {
        [JsonProperty("playlistId")]
        public int PlaylistId { get; set; }

        [JsonProperty("fields")]
        public IEnumerable<Fields> Fields { get; set; }

    }
    public class Fields
    {
        [JsonProperty("clipOrder")]
        public int ClipOrder { get; set; }

        [JsonProperty("footballQtr")]
        public int? FootballQtr { get; set; }

        [JsonProperty("footballOdk")]
        public string FootballOdk { get; set; }
        
        [JsonProperty("customValue1")]
        public string CustomValue1 { get; set; }

        [JsonProperty("customValue2")]
        public string CustomValue2 { get; set; }

        [JsonProperty("customValue3")]
        public string CustomValue3 { get; set; }
    }
}

