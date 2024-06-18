using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class RequestPracticeLibraryUpdate : BaseUserInfo
    {
        [JsonProperty("templateId")]
        public int TemplateId { get; set; }
    }
}
