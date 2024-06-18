using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Input;
using wgfapp.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class LeagueExchangePopupViewModel : BasePopupViewModel
    {
        public ICommand SendFilmCommand { get; private set; }
        public LeagueExchangePopupViewModel(INavigationService navigationService) : base(navigationService)
        {
            SendFilmCommand = new Command(SendFilm);
        }

        private void SendFilm()
        {
            App.Current.MainPage.DisplayAlert("Send Film clicked", "", "OK");
        }
    }
}
