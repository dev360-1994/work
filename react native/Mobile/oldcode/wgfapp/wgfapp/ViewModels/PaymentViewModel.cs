using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Input;
using wgfapp.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class PaymentViewModel : BaseViewModel
    {
        private readonly INavigationService _navigationService;
        public ICommand HelpCommand { get; private set; }
        public PaymentViewModel(INavigationService navigationService)
        {
            _navigationService = navigationService;
            HelpCommand = new Command(NavigateOnHelp);
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "Payment");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }
    }
}
