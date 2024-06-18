using Acr.UserDialogs;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using wgfapp.Common.Models;
using wgfapp.Interfaces;
using wgfapp.Models;
using wgfapp.Service.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class PlaylistsViewModel : BaseViewModel

    {
        //private readonly StatisticsListData data1;
        //private readonly PlayListData data;
        private readonly IPersistanceService _persistanceService;
        private readonly IPlaylistService _playlistService;


        //public IReadOnlyList<StatisticsList> StatisticsLists { get => data1.StatisticsLists; }
        //public IReadOnlyList<PlayList> Playlists { get => data.PlayLists; }

        private readonly INavigationService _navigationService;


        public ICommand LoadPlaylistCommand { get; private set; }
        public ICommand HelpCommand { get; private set; }
        public ICommand DownloadFilmCommand { get; private set; }
        public ICommand ManageFilmCommand { get; private set; }

        public ICommand ViewFilmCommand { get; private set; }

        public ICommand CheckedChangeCommand { get; private set; }


        
        //public event PropertyChangedEventHandler PropertyChanged;

        public ICommand SearchButtonPressed { private set; get; }


        private int _countRow;
        private FilmTeamPlaylist _selectedPlaylist;
        private IList<FilmTeamPlaylist> _recentPlaylist;
        private IList<FilmTeamPlaylist> _favoritePlaylist;
        private IList<FilmTeamPlaylist> _currentPlaylist;
        private IList<FilmTeamPlaylist> _allPlaylist;
        private IList<FilmTeamPlaylist> _trainingPlaylist;
        private IList<FilmTeamPlaylist> _othersPlaylist;
        private bool chk_CheckBox;

        //private IList<bool> _updatePlaylistFavoriteStatus;

        public FilmTeamPlaylist SelectedPlaylist
        {
            get { return _selectedPlaylist; }
            set { SetProperty(ref _selectedPlaylist, value); }
        }

        public IList<FilmTeamPlaylist> RecentPlaylist
        {
            get { return _recentPlaylist; }
            set { SetProperty(ref _recentPlaylist, value); }
        }

        public IList<FilmTeamPlaylist> FavoritePlaylist
        {
            get { return _favoritePlaylist; }
            set { SetProperty(ref _favoritePlaylist, value); }
        }


        public IList<FilmTeamPlaylist> CurrentPlaylist
        {
            get { return _currentPlaylist; }
            set { SetProperty(ref _currentPlaylist, value); }
        }

        public IList<FilmTeamPlaylist> AllPlaylist
        {
            get { return _allPlaylist; }
            set { SetProperty(ref _allPlaylist, value); }
        }

        public IList<FilmTeamPlaylist> TrainingPlaylist
        {
            get { return _trainingPlaylist; }
            set { SetProperty(ref _trainingPlaylist, value); }
        }

        public IList<FilmTeamPlaylist> OthersPlaylist
        {
            get { return _othersPlaylist; }
            set { SetProperty(ref _othersPlaylist, value); }
        }
        public int CountRow
        {
            get { return _countRow; }
            set { SetProperty(ref _countRow, value); }
        }
        public bool IsCheckBoxChecked
        {
            get { return chk_CheckBox; }
            set
            {
                chk_CheckBox = value;
                if (chk_CheckBox)
                    chk_CheckBox = false;
                //PropertyChanged?.Invoke(this, new PropertyChangedEventArgs("IsCheckBoxChecked"));
            }
        }

        public PlaylistsViewModel(INavigationService navigationService, IPersistanceService persistanceService, IPlaylistService playlistService)
        {
            _navigationService = navigationService;
            _persistanceService = persistanceService;
            _playlistService = playlistService;

            //data = new PlayListData();
            //data1 = new StatisticsListData();

            HelpCommand = new Command(NavigateOnHelp);
            DownloadFilmCommand = new Command(DownloadFilm);
            ManageFilmCommand = new Command(ManageFilm);
            ViewFilmCommand = new Command<FilmTeamPlaylist>(ViewFilm);

            LoadPlaylistCommand = new Command(ExecuteLoadPlaylistCommand);
        }


        private void ExecuteLoadPlaylistCommand()
        {
            LoadPlaylist();
        }

        private void ExecuteUpdateFavoriteCommand()
        {
            UserDialogs.Instance.ShowLoading("Loading...");

            //var result = await _playlistService.UpdatePlaylistFavoriteStatus(PlaylistFavoriteStatus favoriteStatus, _persistanceService.Token);
            //UpdatePlaylistFavoriteStatus = (IList<bool>)result;

            //IsEmpty = UpdatePlaylistFavoriteStatus == null || UpdatePlaylistFavoriteStatus.Count == 0;

            UserDialogs.Instance.HideLoading();
        }

        private void DownloadFilm()
        {
            App.Current.MainPage.DisplayAlert("Confirm Download", "Are you sure you want to download this film? You will receive an email with the download link.", "Yes", "No");
        }

        private async void ManageFilm()
        {
            await _navigationService.NavigateToAsync(Enums.PageKey.ManagePlaylist);
        }

        private async void ViewFilm(FilmTeamPlaylist playlist)
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("playlist", playlist);

            await _navigationService.NavigateToAsync(Enums.PageKey.ViewFilm, parameters);
        }

        public async void CheckedChange(FilmTeamPlaylist playlist, bool isChecked)
        {
            if (playlist != null)
            {
                PlaylistFavoriteStatus favoriteStatus = new PlaylistFavoriteStatus();
                favoriteStatus.Playlist = playlist.Playlist;
                favoriteStatus.IsFavorite = (isChecked) ? 1 : 0;
                favoriteStatus.User = _persistanceService.UserInfo.UserId;
                var result = await _playlistService.UpdatePlaylistFavoriteStatus(favoriteStatus, _persistanceService.Token);
                if (((bool)result) == true)
                {
                    LoadPlaylist();
                }
            }
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "Playlist");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }


        public async void OnViewAppear()
        {
            LoadPlaylist();
        }

        private async void LoadPlaylist()
        {
            //UserDialogs.Instance.ShowLoading("Loading...");
            if (IsBusy)
                return;

            IsBusy = true;

            var resultRecent = await _playlistService.GetTeamPlaylists(_persistanceService.UserInfo.TeamId, _persistanceService.UserInfo.UserId, "R", _persistanceService.Token);
            RecentPlaylist = (IList<FilmTeamPlaylist>)resultRecent;

            var resultFavorite = await _playlistService.GetTeamPlaylists(_persistanceService.UserInfo.TeamId, _persistanceService.UserInfo.UserId, "F", _persistanceService.Token);
            FavoritePlaylist = (IList<FilmTeamPlaylist>)resultFavorite;

            var resultCurrent = await _playlistService.GetTeamPlaylists(_persistanceService.UserInfo.TeamId, _persistanceService.UserInfo.UserId, "S", _persistanceService.Token);
            CurrentPlaylist = (IList<FilmTeamPlaylist>)resultCurrent;

            var resultAll = await _playlistService.GetTeamPlaylists(_persistanceService.UserInfo.TeamId, _persistanceService.UserInfo.UserId, "A", _persistanceService.Token);
            AllPlaylist = (IList<FilmTeamPlaylist>)resultAll;

            var resultTraining = await _playlistService.GetTeamPlaylists(_persistanceService.UserInfo.TeamId, _persistanceService.UserInfo.UserId, "T", _persistanceService.Token);
            TrainingPlaylist = (IList<FilmTeamPlaylist>)resultTraining;

            var resultOthers = await _playlistService.GetTeamPlaylists(_persistanceService.UserInfo.TeamId, _persistanceService.UserInfo.UserId, "O", _persistanceService.Token);
            OthersPlaylist = (IList<FilmTeamPlaylist>)resultOthers;

            IsBusy = false;

            IsEmpty = RecentPlaylist == null || RecentPlaylist.Count == 0;
        }


        public PlaylistsViewModel()
        {
            SearchButtonPressed = new Command<string>(HandleSearchPressed);
        }

        private void HandleSearchPressed(string searchText)
        {
            LabelTextPress = searchText;
        }

        string _labelTextPress;
        public string LabelTextPress
        {
            get
            {
                return  _labelTextPress;
            }
            set
            {
                if (_labelTextPress != value)
                {
                    _labelTextPress = value;
                    OnPropertyChanged();
                }
            }
        }


        //UserDialogs.Instance.HideLoading();

        //public class TestPageModel : INotifyPropertyChanged
        //{
        //    private bool isSelected;
        //    public bool IsSelected
        //    {
        //        get
        //        {
        //            return isSelected;
        //        }
        //        set
        //        {
        //            if (isSelected != value)
        //            {
        //                isSelected = value;
        //                NotifyPropertyChanged("IsSelected");
        //            }
        //        }
        //    }

        //    protected virtual void NotifyPropertyChanged([CallerMemberName] string propertyName = "")
        //    {
        //        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        //    }
        //    public event PropertyChangedEventHandler PropertyChanged;
        //}





    }
}
