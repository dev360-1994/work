using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class OperationAccess : BaseUserInfo
    {
        [JsonProperty("userRole")]
        public int UserRole { get; set; }

        [JsonProperty("addComment")]
        public bool AddComment { get; set; }

        [JsonProperty("viewComment")]
        public bool ViewComment { get; set; }

        [JsonProperty("addDrawing")]
        public bool AddDrawing { get; set; }

        [JsonProperty("viewDrawing")]
        public bool ViewDrawing { get; set; }

        [JsonProperty("filmSharing")]
        public bool FilmSharing { get; set; }
    }
}
