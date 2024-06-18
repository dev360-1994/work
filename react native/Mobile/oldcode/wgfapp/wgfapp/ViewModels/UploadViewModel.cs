using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.IO;
using System.Threading.Tasks;
using System.Windows.Input;
using Plugin.Media;
using Plugin.Permissions;
using Plugin.Permissions.Abstractions;
using wgfapp.Interfaces;
using wgfapp.Models;
using wgfapp.Service.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class UploadViewModel : BaseViewModel
    {
        private readonly INavigationService _navigationService;
        private readonly IPersistanceService _persistanceService;
        private readonly IMultiMediaPickerService _multiMediaPickerService;
        private readonly IUploadFilmService _uploadFilmService;
        private VideoInfo _videoDetails;
        private ObservableCollection<MediaFile> _media;
        private BackgroundWorker backgroundWorker = null;
        private string uplodingResult = string.Empty;
        private long dataStartPosition = 0;
        private int MAX_BUFFER_SIZE = 512000;
        private long fileSize;
        private int bufferSize;
        private string messageResult = string.Empty;

        public VideoInfo VideoDetails
        {
            get { return _videoDetails; }
            set { SetProperty(ref _videoDetails, value); }
        }

        public ObservableCollection<MediaFile> Media
        {
            get { return _media; }
            set { SetProperty(ref _media, value); }
        }

        public ICommand HelpCommand { get; private set; }

        public ICommand SelectVideoCommand { get; private set; }

        public UploadViewModel(INavigationService navigationService, IPersistanceService persistanceService, IMultiMediaPickerService multiMediaPickerService, IUploadFilmService uploadFilmService)
        {
            _navigationService = navigationService;
            _persistanceService = persistanceService;
            _multiMediaPickerService = multiMediaPickerService;
            _uploadFilmService = uploadFilmService;

            HelpCommand = new Command(NavigateOnHelp);
            SelectVideoCommand = new Command(OnSelectVideo);

            backgroundWorker = new BackgroundWorker();
            backgroundWorker.WorkerSupportsCancellation = true;
            backgroundWorker.WorkerReportsProgress = true;
            backgroundWorker.DoWork += BackgroundWorker_DoWork; ;
            backgroundWorker.ProgressChanged += BackgroundWorker_ProgressChanged; ;
            backgroundWorker.RunWorkerCompleted += BackgroundWorker_RunWorkerCompleted; ;
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "Upload");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }

        private async void OnSelectVideo()
        {
            var actionSheet = await App.Current.MainPage.DisplayActionSheet("Select Option", "Cancel", null, "Take Video", "Select Single Video", "Select Multiple Videos");
            switch (actionSheet)
            {
                case "Take Video":
                    await TakeVidoeAsync();
                    break;
                case "Select Single Video":
                    await PickVideoAsync();
                    break;
                case "Select Multiple Videos":
                    await PickVideosAsync();
                    break;
            }
        }

        async Task TakeVidoeAsync()
        {
            try
            {
                if (!CrossMedia.Current.IsCameraAvailable || !CrossMedia.Current.IsTakeVideoSupported)
                {
                    await App.Current.MainPage.DisplayAlert("No Camera", ":( No camera avaialble.", "OK");
                    return;
                }

                var file = await CrossMedia.Current.TakeVideoAsync(new Plugin.Media.Abstractions.StoreVideoOptions
                {
                    Name = "wgfapp_video.mp4",
                    Directory = "wgfapp Video",
                    Quality = Plugin.Media.Abstractions.VideoQuality.Medium,
                    DefaultCamera = Plugin.Media.Abstractions.CameraDevice.Rear,
                });

                if (file == null)
                    return;

                var fileInfo = new FileInfo(file.Path);
                VideoDetails = new VideoInfo() { Name = fileInfo.Name, Size = Math.Round(Convert.ToDecimal((fileInfo.Length / 1024) / 1024), 2).ToString() };

                var memoryStream = new MemoryStream();
                file.GetStream().CopyTo(memoryStream);
                await DependencyService.Get<IMediaService>().StoreImageFile(VideoDetails.Name, "wgfApp", memoryStream.ToArray());
                file.Dispose();
            }
            catch (Exception ex)
            {
            }
        }

        private async Task PickVideoAsync()
        {
            try
            {
                if (!CrossMedia.Current.IsPickVideoSupported)
                {
                    await App.Current.MainPage.DisplayAlert("Videos Not Supported", ":( Permission not granted to videos.", "OK");
                    return;
                }

                var file = await CrossMedia.Current.PickVideoAsync();
                if (file == null)
                    return;

                var fileInfo = new FileInfo(file.Path);
                VideoDetails = new VideoInfo() { Name = fileInfo.Name, Size = Math.Round(Convert.ToDecimal((fileInfo.Length / 1024) / 1024), 2).ToString() };

                var memoryStream = new MemoryStream();
                file.GetStream().CopyTo(memoryStream);
                await DependencyService.Get<IMediaService>().StoreImageFile(VideoDetails.Name, "wgfApp", memoryStream.ToArray());

                //await App.Current.MainPage.DisplayAlert("Video Selected", "Location: " + file.Path, "OK");

                // Add your code here to upload it.

                file.Dispose();
            }
            catch (Exception ex)
            {
            }
        }

        private async Task PickVideosAsync()
        {
            try
            {
                var hasPermission = await CheckPermissionsAsync();
                if (hasPermission)
                {
                    Media = new ObservableCollection<MediaFile>();
                    var medias = await _multiMediaPickerService.PickVideosAsync();
                    System.Diagnostics.Debug.WriteLine($"Medias Selected : {medias}");
                    // Add your code here to upload vidoes.
                    if (medias.Count > 0)
                    {
                        Device.BeginInvokeOnMainThread(() =>
                        {
                            foreach (var item in medias)
                                Media.Add(item);
                        });
                        backgroundWorker.RunWorkerAsync(medias);
                    }
                    else
                        Media.Clear();
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Ex : {ex.Message}");
            }
        }

        async Task<bool> CheckPermissionsAsync()
        {
            var retVal = false;
            try
            {
                var status = await CrossPermissions.Current.CheckPermissionStatusAsync<StoragePermission>();
                if (status != PermissionStatus.Granted)
                {
                    if (await CrossPermissions.Current.ShouldShowRequestPermissionRationaleAsync(Plugin.Permissions.Abstractions.Permission.Storage))
                    {
                        await App.Current.MainPage.DisplayAlert("Alert", "Need Storage permission to access to your photos.", "Ok");
                    }

                    var results = await CrossPermissions.Current.RequestPermissionAsync<StoragePermission>();
                    status = results;
                }

                if (status == PermissionStatus.Granted)
                {
                    retVal = true;
                }
                else if (status != PermissionStatus.Unknown)
                {
                    await App.Current.MainPage.DisplayAlert("Alert", "Permission Denied. Can not continue, try again.", "Ok");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                await App.Current.MainPage.DisplayAlert("Alert", "Error. Can not continue, try again.", "Ok");
            }

            return retVal;

        }

        private void BackgroundWorker_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            try
            {
                backgroundWorker.CancelAsync();
            }
            catch (Exception ex)
            {

            }
        }

        private void BackgroundWorker_ProgressChanged(object sender, ProgressChangedEventArgs e)
        {
            try
            {
                if (e.ProgressPercentage == 0)
                {
                    //lblProcess.Text = "Uploading video...";
                }
                else if (e.ProgressPercentage == 1)
                {
                    //lblProcess.Text = "Uploading video...";
                }
                else if (e.ProgressPercentage == 2)
                {
                    backgroundWorker.CancelAsync();
                    GC.Collect(GC.MaxGeneration, GCCollectionMode.Forced);
                }
            }
            catch (Exception ex)
            {

            }
        }

        private void BackgroundWorker_DoWork(object sender, DoWorkEventArgs e)
        {
            try
            {
                var medias = e.Argument as IList<MediaFile>;
                backgroundWorker.ReportProgress(0);
                foreach (var item in medias)
                    uploadMediaFile(item, e);
            }
            catch (Exception ex)
            {

            }
        }

        public void uploadMediaFile(MediaFile mediaFile, DoWorkEventArgs e)
        {
            try
            {
                FileInfo fileInfo = null;
                fileInfo = new FileInfo(mediaFile.Path);
                fileSize = fileInfo.Length;

                using (FileStream videoFile = File.OpenRead(mediaFile.Path))
                {
                    using (var br = new BinaryReader(videoFile))
                    {
                        int length = 0;
                        int totalCount = Convert.ToInt32(fileSize / MAX_BUFFER_SIZE);
                        int indexNo = 0;

                        do
                        {
                            if (backgroundWorker.CancellationPending)
                            {
                                e.Cancel = true;
                                return;
                            }

                            byte[] buffer = new byte[MAX_BUFFER_SIZE];
                            if (dataStartPosition + buffer.Length > fileSize)
                            {
                                var lastBufferSize = (int)(fileSize - dataStartPosition);
                                buffer = new byte[lastBufferSize];
                            }

                            length = br.Read(buffer, 0, buffer.Length);
                            if (length > 0)
                            {
                                string base64String = Convert.ToBase64String(buffer);
                                Common.Models.UploadChunks uploadChunks = new Common.Models.UploadChunks()
                                {
                                    file = buffer,
                                    uploadFile = new Common.Models.ChunkMetadata()
                                    {
                                        FileGuid = Guid.NewGuid().ToString(),
                                        FileName = fileInfo.Name,
                                        FileType = "video/mp4",
                                        FileSize = (int)fileSize,
                                        TotalCount = totalCount,
                                        Index = indexNo
                                    }
                                };
                                base64String = string.Empty;
                                var response = _uploadFilmService.UploadFilm(uploadChunks, _persistanceService.Token).Result;
                                if (response)
                                {
                                    if (backgroundWorker.CancellationPending)
                                    {
                                        e.Cancel = true;
                                        return;
                                    }

                                    if (dataStartPosition + buffer.Length > fileSize)
                                    {
                                        var lastBufferSize = (int)(fileSize - dataStartPosition);
                                        dataStartPosition += lastBufferSize;
                                    }
                                    else
                                    {
                                        dataStartPosition += buffer.Length;
                                    }
                                }
                                indexNo++;
                            }
                            else
                            {
                                backgroundWorker.ReportProgress(2);
                                e.Cancel = true;
                                return;
                            }
                        }
                        while (dataStartPosition < fileSize);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
