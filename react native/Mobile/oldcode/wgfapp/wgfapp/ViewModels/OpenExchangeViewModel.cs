using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Input;
using wgfapp.Interfaces;
using wgfapp.Models;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class OpenExchangeViewModel : BaseViewModel
    {
        readonly StatisticsListData data;
        public IReadOnlyList<StatisticsList> Statisticslists { get => data.StatisticsLists; }
        private readonly INavigationService _navigationService;
        public ICommand HelpCommand { get; private set; }
        public ICommand SelectFilmCommand { get; private set; }
        public OpenExchangeViewModel(INavigationService navigationService)
        {
            data = new StatisticsListData();
            _navigationService = navigationService;
            HelpCommand = new Command(NavigateOnHelp);
            SelectFilmCommand = new Command(NavigateOnOpenExchange);
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "login");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }

        private async void NavigateOnOpenExchange()
        {
            await _navigationService.PushPopupAsync(Enums.PageKey.OpenExchangePopup);
        }
    }
}
