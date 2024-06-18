using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class RequestUploadFile : BaseUserInfo
    {
        [JsonProperty("fileType")]
        public int FileType { get; set; }
    }
}
