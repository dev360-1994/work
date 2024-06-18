using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Windows.Input;
using wgfapp.Common.Models;
using wgfapp.Interfaces;
using wgfapp.Models;
using wgfapp.Service.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class ExchangeInboxViewModel
    {
        private readonly INavigationService _navigationService;
        private readonly IPersistanceService _persistanceService;
        private readonly IExchangeService _exchangeService;

        private readonly ExchangeInboxListData data;
        private readonly PlayListData data1;

        public IReadOnlyList<PlayList> Playlists { get => data1.PlayLists; }
        public IReadOnlyList<ExchangeInboxList> ExchangeInboxlists { get => data.ExchangeInboxLists; }

        public ICommand HelpCommand { get; private set; }
        public ICommand InboxPopupCommand { get; private set; }

        public ExchangeInboxViewModel(INavigationService navigationService, IPersistanceService persistanceService, IExchangeService exchangeService)
        {
            _navigationService = navigationService;
            _persistanceService = persistanceService;
            _exchangeService = exchangeService;
            data1 = new PlayListData();
            data = new ExchangeInboxListData();
            HelpCommand = new Command(NavigateOnHelp);
            InboxPopupCommand = new Command(NavigateOnInboxPopup);
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "login");
            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }

        private async void NavigateOnInboxPopup()
        {
            await _navigationService.PushPopupAsync(Enums.PageKey.ExchangeInboxPopup);
        }

        public async Task OnViewAppearAsync()
        {
            try
            {
                Acr.UserDialogs.UserDialogs.Instance.ShowLoading("Fetching exchange inbox...");

                var exchangeInboxResponse = await _exchangeService.ExchangeInbox(_persistanceService.UserInfo.TeamId, _persistanceService.Token);
                if (exchangeInboxResponse != null && exchangeInboxResponse.Count > 0)
                {

                }
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();
            }
            catch(Exception ex)
            {
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();
            }


        }
    }
}
