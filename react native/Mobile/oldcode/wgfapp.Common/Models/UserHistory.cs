using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class UserHistory
    {
        [JsonProperty("activityId")]
        public int ActivityId { get; set; }

        [JsonProperty("teamName")]
        public string TeamName { get; set; }

        [JsonProperty("fullName")]
        public string FullName { get; set; }

        [JsonProperty("category")]
        public string Category { get; set; }

        [JsonProperty("command")]
        public string Command { get; set; }

        [JsonProperty("details")]
        public string Details { get; set; }

        [JsonProperty("createdDate")]
        public DateTime CreatedDate { get; set; }
    }
}
