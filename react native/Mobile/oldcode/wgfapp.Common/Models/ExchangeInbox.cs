using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class ExchangeInbox
    {
        [JsonProperty("teamId")]
        public int TeamId { get; set; }

        [JsonProperty("filmDate")]
        public DateTime FilmDate { get; set; }

        [JsonProperty("filmId")]
        public int FilmId { get; set; }

        [JsonProperty("filmGuid")]
        public string FilmGuid { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("group")]
        public string Group { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }
    }
}
