using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class PlaybookPage : BaseUserInfo
    {
        [JsonProperty("playbookId")]
        public int PlaybookId { get; set; }

        [JsonProperty("pageNumber")]
        public int PageNumber { get; set; }

        [JsonProperty("pageTitle")]
        public string PageTitle { get; set; }
    }
}
