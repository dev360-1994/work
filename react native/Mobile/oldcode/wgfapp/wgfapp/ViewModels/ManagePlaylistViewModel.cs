using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Input;
using wgfapp.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class ManagePlaylistViewModel : BaseViewModel
    {
        private readonly INavigationService _navigationService;
        public ICommand HelpCommand { get; private set; }
        public ICommand DeleteFilmCommand { get; private set; }
        public ICommand SaveFilmCommand { get; private set; }
        public ManagePlaylistViewModel(INavigationService navigationService)
        {
            _navigationService = navigationService;
            HelpCommand = new Command(NavigateOnHelp);
            DeleteFilmCommand = new Command(DeleteFilm);
            SaveFilmCommand = new Command(SaveFilm);
        }

        private void DeleteFilm()
        {
            App.Current.MainPage.DisplayAlert("Confirm Delete", "Are you sure you want to delete this film? You may recover the deleted film in the next 30 days.", "Yes", "No");
        }

        private void SaveFilm()
        {
            App.Current.MainPage.DisplayAlert("Film Saved", "The film properties have been successfully updated.", "OK");
        }
        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "ManagePlaylist");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }
    }
}
