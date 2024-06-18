using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class ExchangeHistory
    {
        [JsonProperty("exchangeId")]
        public int ExchangeId { get; set; }

        [JsonProperty("eventId")]
        public int EventId { get; set; }

        [JsonProperty("filmId")]
        public int FilmId { get; set; }

        [JsonProperty("oldTeamId")]
        public int OldTeamId { get; set; }

        [JsonProperty("newTeamId")]
        public int NewTeamId { get; set; }

        [JsonProperty("filmTitle")]
        public string FilmTitle { get; set; }

        [JsonProperty("filmDate")]
        public DateTime FilmDate { get; set; }

        [JsonProperty("sendTeam")]
        public string SendTeam { get; set; }

        [JsonProperty("receiveTeam")]
        public string ReceiveTeam { get; set; }

        [JsonProperty("sender")]
        public string Sender { get; set; }   
    }
}
