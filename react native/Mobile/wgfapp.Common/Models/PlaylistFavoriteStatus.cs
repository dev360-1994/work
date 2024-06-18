using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class PlaylistFavoriteStatus
    {
        [JsonProperty("playlist")]
        public int Playlist { get; set; }

        [JsonProperty("user")]
        public int User { get; set; }

        [JsonProperty("isFavorite")]
        public int IsFavorite { get; set; }
    }

}

