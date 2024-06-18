using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Input;
using wgfapp.Interfaces;
using wgfapp.Models;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class PlaylistsViewModel : BaseViewModel
    {
        private readonly StatisticsListData data1;
        private readonly PlayListData data;

        public IReadOnlyList<StatisticsList> StatisticsLists { get => data1.StatisticsLists; }
        public IReadOnlyList<PlayList> Playlists { get => data.PlayLists; }
        private readonly INavigationService _navigationService;
        public ICommand HelpCommand { get; private set; }
        public ICommand DownloadFilmCommand { get; private set; }
        public ICommand ManageFilmCommand { get; private set; }
        public ICommand ViewFilmCommand { get; private set; }

        public PlaylistsViewModel(INavigationService navigationService)
        {
            data = new PlayListData();
            data1 = new StatisticsListData();
            _navigationService = navigationService;
            HelpCommand = new Command(NavigateOnHelp);
            DownloadFilmCommand = new Command(DownloadFilm);
            ManageFilmCommand = new Command(ManageFilm);
            ViewFilmCommand = new Command(ViewFilm);
        }

        private void DownloadFilm()
        {
            App.Current.MainPage.DisplayAlert("Confirm Download", "Are you sure you want to download this film? You will receive an email with the download link.", "Yes", "No");
        }

        private async void ManageFilm()
        {
            await _navigationService.NavigateToAsync(Enums.PageKey.ManagePlaylist);
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "Playlist");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }

        private async void ViewFilm()
        {
            await _navigationService.NavigateToAsync(Enums.PageKey.ViewFilm);
        }
    }
}
