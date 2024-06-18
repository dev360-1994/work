using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class PracticeLibrary
    {
        [JsonProperty("connectName")]
        public string ConnectName { get; set; }

        [JsonProperty("templateId")]
        public int TemplateId { get; set; }

        [JsonProperty("sport")]
        public string Sport { get; set; }

        [JsonProperty("practiceTitle")]
        public string PracticeTitle { get; set; }

        [JsonProperty("practiceDesc")]
        public string PracticeDesc { get; set; }

        [JsonProperty("practicePlan")]
        public string PracticePlan { get; set; }
    }
}
