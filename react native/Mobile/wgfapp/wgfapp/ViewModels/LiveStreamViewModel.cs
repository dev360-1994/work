using System;
using System.Collections.Generic;
using System.Windows.Input;
using wgfapp.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class LiveStreamViewModel : BaseViewModel
    {
        private string _videoSource;
        private bool _isLoading;
        public string VideoSource
        {
            get { return _videoSource; }
            set { SetProperty(ref _videoSource, value); }
        }

        public bool IsLoading
        {
            get { return _isLoading; }
            set { SetProperty(ref _isLoading, value); }
        }
        private readonly INavigationService _navigationService;
        public ICommand HelpCommand { get; private set; }
        public ICommand ViewDetailsCommand { get; private set; }

        public LiveStreamViewModel(INavigationService navigationService)
        {
            _navigationService = navigationService;
            IsLoading = true;
            VideoSource = "https://video1.watchgamefilm.com/disk01/655d7cd2-c6a5-44e0-b3d5-9210709223e8/mp4/480p/9fd65945-edb7-4614-8aea-fe712df3c4bc.480p.mp4";
            HelpCommand = new Command(NavigateOnHelp);
            ViewDetailsCommand = new Command(ViewDetails);
        }

        private void ViewDetails()
        {
            App.Current.MainPage.DisplayAlert("View Details", "This is where information about the live stream will display.", "OK");
        }
        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "LiveStream");
            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }
    }
}
