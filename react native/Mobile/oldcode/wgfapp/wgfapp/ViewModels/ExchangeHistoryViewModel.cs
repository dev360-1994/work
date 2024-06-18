using System;
using System.Collections.Generic;
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
    public class ExchangeHistoryViewModel : BaseViewModel
    {
        private readonly INavigationService _navigationService;
        private readonly StatisticsListData data;
        private readonly IPersistanceService _persistanceService;
        private readonly IExchangeService _exchangeService;

        public IReadOnlyList<StatisticsList> Statisticslists { get => data.StatisticsLists; }
        public ICommand HelpCommand { get; private set; }

        public ExchangeHistoryViewModel(INavigationService navigationService, IPersistanceService persistanceService, IExchangeService exchangeService)
        {
            data = new StatisticsListData();
            _navigationService = navigationService;
            _persistanceService = persistanceService;
            _exchangeService = exchangeService;
            HelpCommand = new Command(NavigateOnHelp);
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "exchangehistory");
            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }

        public async Task OnViewAppearAsync()
        {
            try
            {
                Acr.UserDialogs.UserDialogs.Instance.ShowLoading("Fetching exchange history...");

                var exchangeHistoryResponse = await _exchangeService.ExchangeHistory(_persistanceService.UserInfo.TeamId, _persistanceService.Token);
                if (exchangeHistoryResponse != null && exchangeHistoryResponse.Count > 0)
                {

                }
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();


                //var exchangePlayListResponse = await _exchangeService.ExchangePlayList(_persistanceService.UserInfo.TeamId, _persistanceService.Token);
                //if (exchangePlayListResponse != null && exchangePlayListResponse.Count > 0)
                //{

                //}
            }
            catch(Exception ex)
            {
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();
            }

        }
    }
}
