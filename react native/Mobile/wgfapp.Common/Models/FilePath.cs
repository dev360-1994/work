using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class FilePath : BaseUserInfo
    {
        [JsonProperty("fileType")]
        public string FileType { get; set; }
    }
}
