using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class PracticePlanner : BaseUserInfo
    {
        [JsonProperty("practicePlan")]
        public string PracticePlan { get; set; }

        [JsonProperty("practiceDate")]
        public DateTime PracticeDate { get; set; }
    }
}
