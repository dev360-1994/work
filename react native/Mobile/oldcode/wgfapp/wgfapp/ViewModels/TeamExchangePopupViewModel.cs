using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Input;
using wgfapp.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class TeamExchangePopupViewModel : BasePopupViewModel
    {
        private readonly INavigationService _navigationService;
        public ICommand FindTeamCommand { get; private set; }
        public ICommand SendFilmCommand { get; private set; }

        public TeamExchangePopupViewModel(INavigationService navigationService) : base(navigationService)
        {
            _navigationService = navigationService;
            FindTeamCommand = new Command(FindTeam);
            SendFilmCommand = new Command(SendFilm);
        }

        private void FindTeam()
        {
            App.Current.MainPage.DisplayAlert("Find Team clicked", "", "OK");
        }

        private void SendFilm()
        {
            App.Current.MainPage.DisplayAlert("Send Film clicked", "", "OK");
        }
    }
}
