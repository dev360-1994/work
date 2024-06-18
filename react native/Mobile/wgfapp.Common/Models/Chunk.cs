using System;
using Newtonsoft.Json;

namespace wgfapp.Common.Models
{
    public class Chunk
    {
        public string File { get; set; }

        public string ChunkMetadata { get; set; }
    }
}
