using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Input;
using TEditor;
using TEditor.Abstractions;
using wgfapp.Common.Models;
using wgfapp.Interfaces;
using wgfapp.Service.Interfaces;
using Xamarin.Essentials;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class UploadTemplateViewModel : BasePopupViewModel
    {
        private readonly INavigationService _navigationService;
        private readonly IPracticePlannerService _practicePlannerService;
        private readonly IPersistanceService _persistanceService;

        public ICommand BrowseCommnad { get; set; }

        public UploadTemplateViewModel(INavigationService navigationService, IPersistanceService persistanceService, IPracticePlannerService practicePlannerService) : base(navigationService)
        {
            PopupTitle = "Upload Template";
            _persistanceService = persistanceService;
            _practicePlannerService = practicePlannerService;
            _navigationService = navigationService;
            BrowseCommnad = new Command(OnBrowse);
        }

        private async void OnBrowse()
        {
            var fileResult = await PickAndShow();

            if (fileResult == null)
                return;

            string extension = Path.GetExtension(fileResult.FileName);
            if (extension == ".html" || extension == ".htm")
            {
                string content = File.ReadAllText(fileResult.FullPath);
                var readdata = fileResult.OpenReadAsync();
                StreamReader reader = new StreamReader(readdata.Result);
                string htmlContent = reader.ReadToEnd();

                CrossTEditor.SaveText = "Save";
                CrossTEditor.CancelText = "Cancel";
                TEditorResponse response = await CrossTEditor.Current.ShowTEditor(htmlContent);
                if (response.IsSave && response.HTML != null)
                {
                    RequestTemplateUpdate requestTemplateUpdate = new RequestTemplateUpdate()
                    {
                        TeamId = _persistanceService.UserInfo.TeamId,
                        UserId = _persistanceService.UserInfo.UserId,
                        PracticePlan = response.HTML
                    };

                    Acr.UserDialogs.UserDialogs.Instance.ShowLoading("Saving template...");
                    var updateTemplateResponse = await _practicePlannerService.UpdatePraticeTamplate(requestTemplateUpdate, _persistanceService.Token);
                    Acr.UserDialogs.UserDialogs.Instance.HideLoading();
                    if (updateTemplateResponse.Status != HttpStatusCode.OK)
                    {
                        await App.Current.MainPage.DisplayAlert("Not Save", updateTemplateResponse.Message, "OK");
                        return;
                    }

                    await App.Current.MainPage.DisplayAlert("Saved", updateTemplateResponse.Message, "OK");
                }
            }
        }

        async Task<FileResult> PickAndShow()
        {
            try
            {
                var customFileType = new FilePickerFileType(new Dictionary<DevicePlatform, IEnumerable<string>>
                {
                    { DevicePlatform.iOS, new[] { ".html", ".htm" } }, // or general UTType values
                    { DevicePlatform.Android, new[] { ".html", ".htm" } },
                });

                var options = new PickOptions
                {
                    PickerTitle = "Please select a Html file",
                    FileTypes = customFileType,
                };

                var result = await FilePicker.PickAsync();
                if (result != null)
                    return result;

            }
            catch (Exception ex)
            {
                // The user canceled or something went wrong
            }

            return null;
        }
    }
}
