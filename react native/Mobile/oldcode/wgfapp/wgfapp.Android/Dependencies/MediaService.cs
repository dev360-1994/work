using System;
using System.IO;
using System.Threading.Tasks;
using wgfapp.Droid.Dependencies;
using wgfapp.Interfaces;

[assembly: Xamarin.Forms.Dependency(typeof(MediaService))]
namespace wgfapp.Droid.Dependencies
{
    public class MediaService : Java.Lang.Object, IMediaService, IDisposable
    {
        public MediaService()
        {
        }

        public Task<bool> StoreImageFile(string filename, string location, byte[] fileByte)
        {
            bool result = false;
            try
            {
                result = SaveImage(location, fileByte, filename);
            }
            catch (Exception ex)
            {
            }
            return new Task<bool>(() => result); ;
        }

        //public bool SaveImage(string collectionName, byte[] fileByte, string fileName)
        //{
        //    try
        //    {

        //        var fileDir = new Java.IO.File(GetExternalStoragePublicDirectory(Environment.DirectoryPictures), collectionName);

        //        if (!fileDir.Exists())
        //        {
        //            fileDir.Mkdirs();
        //        }

        //        var file = new Java.IO.File(fileDir, fileName);
        //        System.IO.File.WriteAllBytes(file.Path, fileByte);
        //        return true;
        //    }
        //    catch (System.Exception ex)
        //    {
        //    }
        //    return false;
        //}

        public bool SaveImage(string collectionName, byte[] fileByte, string fileName)
        {
            try
            {

                var doc = Environment.GetFolderPath(Environment.SpecialFolder.MyVideos);
                string filename = collectionName;
                var videopath = Path.Combine(doc, filename);
                System.IO.File.WriteAllBytes(videopath, fileByte);
                return true;
            }
            catch (System.Exception ex)
            {
            }
            return false;
        }

        public new void Dispose()
        {
            //GC.SuppressFinalize(this);
            GC.Collect(GC.MaxGeneration, GCCollectionMode.Forced);
        }
    }
}