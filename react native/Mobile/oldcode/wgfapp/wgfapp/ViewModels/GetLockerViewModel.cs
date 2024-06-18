using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Input;
using wgfapp.Interfaces;
using wgfapp.Models;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class GetLockerViewModel : BaseViewModel
    {
        private readonly INavigationService _navigationService;
        private readonly StatisticsListData data;

        public IReadOnlyList<StatisticsList> Statisticslists { get => data.StatisticsLists; }

        public ICommand HelpCommand { get; private set; }
        public ICommand SelectFilmCommand { get; private set; }

        public GetLockerViewModel(INavigationService navigationService)
        {
            data = new StatisticsListData();
            _navigationService = navigationService;
            HelpCommand = new Command(NavigateOnHelp);
            SelectFilmCommand = new Command(NavigateOnGetLocker);
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "GetLocker");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }

        private async void NavigateOnGetLocker()
        {
            await _navigationService.PushPopupAsync(Enums.PageKey.GetLockerPopup);
        }
    }
}
