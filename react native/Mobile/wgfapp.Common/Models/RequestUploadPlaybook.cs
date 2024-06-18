using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class RequestUploadPlaybook : BaseUserInfo
    {
        [JsonProperty("pageCount")]
        public int PageCount { get; set; }

        [JsonProperty("playbookFile")]
        public string PlaybookFile { get; set; }

        [JsonProperty("playbookName")]
        public string PlaybookName { get; set; }
    }
}
