using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Input;
using wgfapp.Interfaces;
using wgfapp.Models;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class AddLockerViewModel : BaseViewModel
    {
        private readonly StatisticsListData data;
        private readonly INavigationService _navigationService;
        public IReadOnlyList<StatisticsList> Statisticslists { get => data.StatisticsLists; }

        public ICommand HelpCommand { get; private set; }
        public ICommand AddLockerPopupCommand { get; private set; }

        public AddLockerViewModel(INavigationService navigationService)
        {
            data = new StatisticsListData();
            _navigationService = navigationService;
            HelpCommand = new Command(NavigateOnHelp);
            AddLockerPopupCommand = new Command(NavigateOnAddLockerPopup);
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "AddLocker");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }

        private async void NavigateOnAddLockerPopup()
        {
            await _navigationService.PushPopupAsync(Enums.PageKey.AddLockerPopup);
        }
    }
}
