using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class TeamPlayList
    {
        [JsonProperty("eventDate")]
        public int EventDate { get; set; }

        [JsonProperty("eventId")]
        public int EventId { get; set; }

        [JsonProperty("playlistGroup")]
        public string PlaylistGroup { get; set; }

        [JsonProperty("playlistName")]
        public string PlaylistName { get; set; }

        [JsonProperty("playlistId")]
        public int PlaylistId { get; set; }

        [JsonProperty("eventName")]
        public string EventName { get; set; }
    }
}
