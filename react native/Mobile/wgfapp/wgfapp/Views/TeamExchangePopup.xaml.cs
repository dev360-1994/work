using Rg.Plugins.Popup.Pages;
using wgfapp.ViewModels;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class TeamExchangePopup : PopupPage
    {
        private readonly TeamExchangePopupViewModel _teamExchangePopupViewModel;
        public TeamExchangePopup(TeamExchangePopupViewModel teamExchangePopupViewModel)
        {
            InitializeComponent();
            _teamExchangePopupViewModel = teamExchangePopupViewModel;
            BindingContext = _teamExchangePopupViewModel;
        }
    }
}