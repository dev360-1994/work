using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class RenamePlaybook : BaseUserInfo
    {
        [JsonProperty("playbookId")]
        public int PlaybookId { get; set; }

        [JsonProperty("playbookName")]
        public string PlaybookName { get; set; }
    }
}
