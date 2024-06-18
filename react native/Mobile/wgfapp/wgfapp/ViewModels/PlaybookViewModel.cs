using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using wgfapp.Common.Models;
using wgfapp.Interfaces;
using wgfapp.Service.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class PlaybookViewModel : BaseViewModel
    {
        private readonly INavigationService _navigationService;
        private readonly IPlayBookService _playBookService;
        private readonly IPersistanceService _persistanceService;
        private readonly IPlaylistClipsService _playlistClipsService;
        private readonly ITeamUsersService _teamUsersService;
        private readonly IUploadFilmService _uploadFilmService;
        private readonly IUtilitiesService _utilitiesService;
        private readonly IFileService _fileService;


        public ICommand HelpCommand { get; private set; }
        public PlaybookViewModel(INavigationService navigationService, IFileService fileService, IUtilitiesService utilitiesService, IUploadFilmService uploadFilmService, ITeamUsersService teamUsersService, IPlaylistClipsService playlistClipsService, IPersistanceService persistanceService, IPlayBookService playBookService)
        {
            _navigationService = navigationService;
            _playBookService = playBookService;
            _persistanceService = persistanceService;
            _playlistClipsService = playlistClipsService;
            _teamUsersService = teamUsersService;
            _uploadFilmService = uploadFilmService;
            _utilitiesService = utilitiesService;
            _fileService = fileService;
            HelpCommand = new Command(NavigateOnHelp);
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "Playbook");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }

        public async Task OnViewAppearAsync()
        {
           try
            {
                Acr.UserDialogs.UserDialogs.Instance.ShowLoading("Fetching plabook list...");

                var plannerResponse = await _playBookService.GetPlaybookList(_persistanceService.UserInfo.TeamId, _persistanceService.Token);
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();
            }
            catch(Exception ex)
            {
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();
            }
        }
    }
}
