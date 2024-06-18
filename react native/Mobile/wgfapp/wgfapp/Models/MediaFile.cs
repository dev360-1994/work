using System;
using System.Collections.Generic;
using System.Text;
using wgfapp.Enums;

namespace wgfapp.Models
{
    public class MediaFile
    {
        public string PreviewPath { get; set; }
        public string Path { get; set; }
        public MediaFileType Type { get; set; }
    }
}
