using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace wgfapp.Common.Models
{
    public class Download : BaseUserInfo
    {
        [JsonProperty("playlistId")]
        public int PlaylistId { get; set; }

        [JsonProperty("isEmailed")]
        public bool IsEmailed { get; set; }
    }

}

