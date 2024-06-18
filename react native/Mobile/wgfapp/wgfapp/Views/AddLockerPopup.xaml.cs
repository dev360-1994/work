using System;
using Rg.Plugins.Popup.Pages;
using wgfapp.ViewModels;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class AddLockerPopup : PopupPage
    {
        private readonly AddLockerPopupViewModel _addLockerPopupViewModel;

        public AddLockerPopup(AddLockerPopupViewModel addLockerPopupViewModel)
        {
            InitializeComponent();
            _addLockerPopupViewModel = addLockerPopupViewModel;
            BindingContext = _addLockerPopupViewModel;
        }
    }
}