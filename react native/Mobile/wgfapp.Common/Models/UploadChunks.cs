using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class UploadChunks
    {
        public byte[] file { get; set; }

        public ChunkMetadata uploadFile { get; set; }
    }

    public class ChunkMetadata
    {
        public string FileName { get; set; }

        public int Index { get; set; }

        public int TotalCount { get; set; }

        public int FileSize { get; set; }

        public string FileType { get; set; }

        public string FileGuid { get; set; }
    }
}
