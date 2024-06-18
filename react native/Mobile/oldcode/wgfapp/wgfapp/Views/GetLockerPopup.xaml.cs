using System;
using Rg.Plugins.Popup.Pages;
using wgfapp.ViewModels;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class GetLockerPopup : PopupPage
    {
        private readonly GetLockerPopupViewModel _getLockerPopupViewModel;

        public GetLockerPopup(GetLockerPopupViewModel getLockerPopupViewModel)
        {
            InitializeComponent();
            _getLockerPopupViewModel = getLockerPopupViewModel;
            BindingContext = _getLockerPopupViewModel;
        }
    }
}