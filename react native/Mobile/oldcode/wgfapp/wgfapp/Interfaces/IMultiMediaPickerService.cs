using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using wgfapp.Handlers;
using wgfapp.Models;

namespace wgfapp.Interfaces
{
    public interface IMultiMediaPickerService
    {
        Task<IList<MediaFile>> PickVideosAsync();

        void Clean();
    }
}
