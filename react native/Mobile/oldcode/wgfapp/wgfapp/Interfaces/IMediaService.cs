using System.Collections.Generic;
using System.Threading.Tasks;

namespace wgfapp.Interfaces
{
    public interface IMediaService
    {
        Task<bool> StoreImageFile(string filename, string location, byte[] fileByte);
    }
}
