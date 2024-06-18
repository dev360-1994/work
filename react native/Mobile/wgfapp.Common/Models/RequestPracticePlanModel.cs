using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class RequestPracticePlanModel : BaseUserInfo
    {
        [JsonProperty("practiceDate")]
        public string PracticeDate { get; set; }
    }
}
