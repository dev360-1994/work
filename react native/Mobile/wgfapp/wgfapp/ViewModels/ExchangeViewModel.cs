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
    public class ExchangeViewModel : BaseViewModel
    {
        private readonly INavigationService _navigationService;
        private readonly IPersistanceService _persistanceService;
        private readonly IExchangeService _exchangeService;

        public ICommand HelpCommand { get; private set; }
        public ICommand PostFilmCommand { get; private set; }
        public ICommand OnViewPostFilmCommand { get; private set; }

        public ExchangeViewModel(INavigationService navigationService, IPersistanceService persistanceService, IExchangeService exchangeService)
        {
            _navigationService = navigationService;
            _persistanceService = persistanceService;
            _exchangeService = exchangeService;
            HelpCommand = new Command(NavigateOnHelp);
            PostFilmCommand = new Command(PostFilm);
            OnViewPostFilmCommand = new Command(OnViewPostFilm);
        }

        private void PostFilm()
        {
            App.Current.MainPage.DisplayAlert("Swipe right Post Film clicked", "", "OK");
        }

        private void OnViewPostFilm()
        {
            App.Current.MainPage.DisplayAlert("Swipe right View report clicked", "", "OK");
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "Exchange");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }

        public async Task OnViewAppearAsync()
        {
            Acr.UserDialogs.UserDialogs.Instance.ShowLoading("Fetching exchange playlist...");
           
            var exchangePlaylistResponse = await _exchangeService.ExchangeInbox(_persistanceService.UserInfo.TeamId, _persistanceService.Token);
            if (exchangePlaylistResponse != null && exchangePlaylistResponse.Count > 0)
            {

            }
            Acr.UserDialogs.UserDialogs.Instance.HideLoading();


        }
    }
}
