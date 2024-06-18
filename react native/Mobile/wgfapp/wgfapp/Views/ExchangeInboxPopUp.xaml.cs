using Rg.Plugins.Popup.Pages;
using wgfapp.ViewModels;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class ExchangeInboxPopUp : PopupPage
    {
        private readonly ExchangeInboxPopUpViewModel _exchangeInboxPopUpViewModel;

        public ExchangeInboxPopUp(ExchangeInboxPopUpViewModel exchangeInboxPopUpViewModel)
        {
            InitializeComponent();
            _exchangeInboxPopUpViewModel = exchangeInboxPopUpViewModel;
            BindingContext = _exchangeInboxPopUpViewModel;
        }
    }
}