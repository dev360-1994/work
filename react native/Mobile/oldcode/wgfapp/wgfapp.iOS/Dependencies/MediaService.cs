using System;
using System.IO;
using System.Threading.Tasks;
using wgfapp.Interfaces;
using wgfapp.iOS.Dependencies;

[assembly: Xamarin.Forms.Dependency(typeof(MediaService))]
namespace wgfapp.iOS.Dependencies
{
    public class MediaService : IMediaService, IDisposable
    {
        public MediaService()
        {
        }

        async Task<bool> IMediaService.StoreImageFile(string filename, string location, byte[] fileByte)
        {
            try
            {
                bool result = SaveImage(location, fileByte, filename);
                return result;
            }
            catch (Exception ex)
            {
            }
            return false;
        }


        public bool SaveImage(string collectionName, byte[] fileByte, string fileName)
        {
            try
            {

                var doc = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
                string filename = Path.GetRandomFileName() + ".mov";
                var videopath = Path.Combine(doc, filename);
                System.IO.File.WriteAllBytes(videopath, fileByte);
                return true;
            }
            catch (System.Exception ex)
            {
            }
            return false;
        }

        public void Dispose()
        {
            //GC.SuppressFinalize(this);
            GC.Collect(GC.MaxGeneration, GCCollectionMode.Forced);
        }


    }
}
