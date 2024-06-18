using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class HighlightClip : BaseUserInfo
    {
        [JsonProperty("eventId")]
        public int EventId { get; set; }

        [JsonProperty("playlistId")]
        public int PlaylistId { get; set; }

        [JsonProperty("clipStart")]
        public int ClipStart { get; set; }

        [JsonProperty("clipStop")]
        public int ClipStop { get; set; }

        [JsonProperty("origGuid")]
        public string OrigGuid { get; set; }

        [JsonProperty("clipName")]
        public string ClipName { get; set; }
    }
}
