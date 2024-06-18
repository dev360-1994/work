using System.Collections.Generic;
using System.Windows.Input;
using wgfapp.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class DocumentsViewModel : BaseViewModel
    {
        private readonly INavigationService _navigationService;

        public ICommand HelpCommand { get; private set; }

        public DocumentsViewModel(INavigationService navigationService)
        {
            _navigationService = navigationService;
            HelpCommand = new Command(NavigateOnHelp);
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "Documents");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }
    }
}
