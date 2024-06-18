using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Input;
using wgfapp.Interfaces;
using wgfapp.Models;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class StatisticsViewModel : BaseViewModel
    {
        private readonly StatisticsListData data;
        public IReadOnlyList<StatisticsList> Statisticslists { get => data.StatisticsLists; }

        private readonly INavigationService _navigationService;
        public ICommand HelpCommand { get; private set; }
        public ICommand SelectReportCommand { get; private set; }
        public StatisticsViewModel(INavigationService navigationService)
        {
            data = new StatisticsListData();
            _navigationService = navigationService;
            HelpCommand = new Command(NavigateOnHelp);
            SelectReportCommand = new Command(SelectReport);
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "Statistics");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }

        private void SelectReport()
        {
            _navigationService.NavigateToAsync(Enums.PageKey.Report);
        }
    }
}
