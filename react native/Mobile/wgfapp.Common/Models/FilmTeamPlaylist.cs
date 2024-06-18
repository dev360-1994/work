using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class FilmTeamPlaylist
    {
        [JsonProperty("team")]
        public int Team { get; set; }

        [JsonProperty("playlist")] 
        public int Playlist { get; set; }

        [JsonProperty("favourite")] 
        public bool Favourite { get; set; }

        [JsonProperty("date")]
        public DateTime? Date { get; set; }

        [JsonProperty("group")] 
        public string Group { get; set; }

        [JsonProperty("name")] 
        public string Name { get; set; }

        [JsonProperty("view")] 
        public int View { get; set; }

        [JsonProperty("tags")] 
        public string Tags { get; set; }

        [JsonProperty("cameras")] 
        public int Cameras { get; set; }

        [JsonProperty("clips")] 
        public int Clips { get; set; }
    }
}
