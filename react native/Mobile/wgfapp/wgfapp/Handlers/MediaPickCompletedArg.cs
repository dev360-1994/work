using System;
using System.Collections.Generic;
using wgfapp.Models;
using Xamarin.Forms;

namespace wgfapp.Handlers
{
    public class MediaPickCompletedArg : EventArgs
    {
        public IList<MediaFile> MediaFiles { get; private set; }

        public MediaPickCompletedArg(IList<MediaFile> mediaFiles)
        {
            MediaFiles = mediaFiles;
        }
    }
}

