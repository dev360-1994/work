using Rg.Plugins.Popup.Pages;
using Rg.Plugins.Popup.Services;
using System;
using wgfapp.ViewModels;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class OpenExchangePopup : PopupPage
    {
        private readonly OpenExchangePopupViewModel _openExchangePopupViewModel;
        public OpenExchangePopup(OpenExchangePopupViewModel openExchangePopupViewModel)
        {
            InitializeComponent();
            _openExchangePopupViewModel = openExchangePopupViewModel;
            BindingContext = _openExchangePopupViewModel;
        }
    }
}