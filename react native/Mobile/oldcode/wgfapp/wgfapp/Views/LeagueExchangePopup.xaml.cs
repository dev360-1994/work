using System;
using Rg.Plugins.Popup.Pages;
using wgfapp.ViewModels;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class LeagueExchangePopup : PopupPage
    {
        private readonly LeagueExchangePopupViewModel _leagueExchangePopupViewModel;

        public LeagueExchangePopup(LeagueExchangePopupViewModel leagueExchangePopupViewModel)
        {
            InitializeComponent();
            _leagueExchangePopupViewModel = leagueExchangePopupViewModel;
            BindingContext = _leagueExchangePopupViewModel;
        }
    }
}