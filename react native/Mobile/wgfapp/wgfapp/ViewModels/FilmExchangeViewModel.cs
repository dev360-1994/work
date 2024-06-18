using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using wgfapp.Interfaces;
using wgfapp.Models;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class FilmExchangeViewModel : BaseViewModel
    {
        private readonly INavigationService _navigationService;
        private readonly ExchangeInboxListData data;

        private ExchangeInboxList _selectedExchangeInboxItem;
        public IReadOnlyList<ExchangeInboxList> ExchangeInboxlists { get => data.ExchangeInboxLists; }
        public ExchangeInboxList SelectedExchangeInboxItem
        {
            get { return _selectedExchangeInboxItem; }
            set { SetProperty(ref _selectedExchangeInboxItem, value); }
        }

        public ICommand ExchangeItemSelectedCommand { get; private set; }
        public ICommand HelpCommand { get; private set; }
        public FilmExchangeViewModel(INavigationService navigationService)
        {
            _navigationService = navigationService;
            data = new ExchangeInboxListData();
            ExchangeItemSelectedCommand = new Command(async () => await ExchangeItemSelected());
            HelpCommand = new Command(NavigateOnHelp);
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "Exchange");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }

        private async Task ExchangeItemSelected()
        {
            if (SelectedExchangeInboxItem == null)
                return;

            if(SelectedExchangeInboxItem.PageKey == Enums.PageKey.HelpPopup)
            {
                var parameters = new Dictionary<string, object>();
                parameters.Add("pageName", "RecvHudl");

                await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
            }
            else
            {
                await _navigationService.NavigateToAsync(SelectedExchangeInboxItem.PageKey);
            }

            SelectedExchangeInboxItem = null;
        }
    }
}
