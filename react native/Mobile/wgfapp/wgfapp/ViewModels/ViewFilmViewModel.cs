using Acr.UserDialogs;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using wgfapp.Common.Models;
using wgfapp.Interfaces;
using wgfapp.Service.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class ViewFilmViewModel : BaseViewModel
    {
        private readonly INavigationService _navigationService;
        private readonly IPersistanceService _persistanceService;
        private readonly IPlaylistService _playlistService;
        public ICommand HelpCommand { get; private set; }

        public ICommand ClipFilmCommand { get; private set; }
        public ICommand GoToTabCommand { get; set; }

        private BindingList<Clip> _cliplist;
        private string _clipSourceUrl;

        private FilmTeamPlaylist _selectedPlaylist;
        private Clip _selectedClip;

        public BindingList<Clip> Clips
        {
            get { return _cliplist; }
            set { SetProperty(ref _cliplist, value); }
        }
        public string ClipSourceUrl
        {
            get { return _clipSourceUrl; }
            set { SetProperty(ref _clipSourceUrl, value); }
        }

        public string VideoTitle
        {
            get { return _selectedPlaylist.Name; }
        }

        public Clip SelectedClip
        {
            get
            {
                return _selectedClip;
            }
            set
            {
                _selectedClip = value;
                this.ClipSourceUrl = GetClipSourceUrl("standard-definition", value);

                OnPropertyChanged(nameof(SelectedClip));
                GoToTab();
            }
        }

        public ViewFilmViewModel(INavigationService navigationService, IPersistanceService persistanceService, IPlaylistService playlistService)
        {
            _navigationService = navigationService;
            _persistanceService = persistanceService;
            _playlistService = playlistService;
            HelpCommand = new Command(NavigateOnHelp);
            GoToTabCommand = new Command(GoToTab);
            ClipFilmCommand = new Command<Clip>(ClipFilm);
        }

        private void GoToTab()
        {
            MessagingCenter.Send<ViewFilmViewModel, int>(this, "SetActiveTab", 0); //REPLACE 1 with the index of your tab
        }
        private async void ClipFilm(Clip selectedClip)
        {
            //var parameters = new Dictionary<string, object>();
            //parameters.Add("playlist", Clips);

            this.ClipSourceUrl = GetClipSourceUrl("standard-definition", Clips[0]);
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "ViewFilm");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }

        public void SetPlaylistInfo(FilmTeamPlaylist playlist)
        {
            if (playlist == null)
            {
                return;
            }

            _selectedPlaylist = playlist;
          
        }
        public async void OnViewAppear()
        {
            LoadPlaylist();
        }

        public event PropertyChangedEventHandler PropertyChanged;

        private void OnPropertyChanged(string property)
        {
            if (PropertyChanged != null)
                PropertyChanged(this, new PropertyChangedEventArgs(property));
        }

        private string GetAzureBlobURLForClip(string filmServerUrl, string videoQuality, Clip clip)
        {
            string resulUrl = filmServerUrl + "/" + clip.TeamId + "/" + clip.FilmGuid;

            switch (videoQuality)
            {
                case "high-definition":
                    resulUrl = resulUrl + "/1080p/" + clip.ClipClientName;
                    break;
                case "standard-definition":
                    resulUrl = resulUrl + "/480p/" + clip.ClipClientName;
                    break;
                default:
                    resulUrl = resulUrl + "/480p/" + clip.ClipClientName;
                    break;
            }

            return resulUrl;

          
        }

        private string GetFileServerURLForClip(string videoQuality, Clip clip)
        {
            string resulUrl = "https://" + clip.TeamServer + "/" + clip.TeamDisk + "/" + clip.TeamGuid + "/mp4";

            switch (videoQuality)
            {
                case "high-definition":
                    resulUrl = resulUrl + "/1080p/" + clip.ClipGuid + ".1080p.mp4";
                    break;
                case "standard-definition":
                    resulUrl = resulUrl + "/480p/" + clip.ClipGuid + ".480p.mp4";
                    break;
                default:
                    resulUrl = resulUrl + "/480p/" + clip.ClipGuid + ".480p.mp4";
                    break;
            }

            return resulUrl;
        }

        private string GetClipSourceUrl(string videoQuality, Clip clip)
        {
            string resulUrl = "";

            if (clip.ClipServerName == "https://wgfstorage.blob.core.windows.net")
            {
                resulUrl = GetAzureBlobURLForClip("",videoQuality, clip);
            }
            else
            {
                resulUrl = GetFileServerURLForClip(videoQuality, clip);
            }

            return resulUrl;
        }

        private async void LoadPlaylist()
        {
            UserDialogs.Instance.ShowLoading("Loading...");
            if (IsBusy)
                return;

            IsBusy = true;

            var result = await _playlistService.GetPlaylistClipsViewById(this._selectedPlaylist.Playlist, this._selectedPlaylist.View, _persistanceService.Token);
            Clips = (BindingList<Clip>)result;

        
            IsEmpty = Clips == null || Clips.Count == 0;

            if(Clips.Count > 0)
            {
                this.ClipSourceUrl = GetClipSourceUrl("standard-definition", Clips[0]);
            }

            IsBusy = false;

            UserDialogs.Instance.HideLoading();
         
        }
    }
}
