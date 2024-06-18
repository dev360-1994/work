using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class RequestTemplateUpdate : BaseUserInfo
    {
        [JsonProperty("practicePlan")]
        public string PracticePlan { get; set; }
    }
}
