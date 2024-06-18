using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class ExchangePlayList
    {
        [JsonProperty("playlistId")]
        public int PlaylistId { get; set; }

        [JsonProperty("date")]
        public DateTime Date { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("camera")]
        public int Camera { get; set; }

        [JsonProperty("tags")]
        public string Tags { get; set; }
    }
}
