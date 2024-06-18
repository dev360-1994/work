using System;
using System.Windows.Input;
using wgfapp.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class BasePopupViewModel : BaseViewModel
    {
        private readonly INavigationService _navigationService;
        private string _popupTitle;

        public string PopupTitle
        {
            get { return _popupTitle; }
            set { SetProperty(ref _popupTitle, value); }
        }

        public ICommand ClosePopupCommand { get; private set; }

        public BasePopupViewModel(INavigationService navigationService)
        {
            _navigationService = navigationService;
            ClosePopupCommand = new Command(ClosePopup);
        }

        private void ClosePopup()
        {
            _navigationService.PopPopupAsync();
        }
    }
}
