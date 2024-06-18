using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class Playbook : BaseUserInfo
    {
        [JsonProperty("playbookId")]
        public int PlaybookId { get; set; }

        [JsonProperty("playbookName")]
        public string PlaybookName { get; set; }

        [JsonProperty("pageCount")]
        public int PageCount { get; set; }

        [JsonProperty("playbookFile")]
        public string PlaybookFile { get; set; }
    }
}
