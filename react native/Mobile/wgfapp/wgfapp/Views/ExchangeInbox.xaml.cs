using wgfapp.Interfaces;
using wgfapp.Service.Interfaces;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class ExchangeInbox : ContentPage
    {
        private readonly ExchangeInboxViewModel _exchangeInboxViewModel;
        

        public ExchangeInbox(ExchangeInboxViewModel exchangeInboxViewModel)
        {
            InitializeComponent();
            _exchangeInboxViewModel = exchangeInboxViewModel;
            BindingContext = _exchangeInboxViewModel;
        }

        protected async override void OnAppearing()
        {
            base.OnAppearing();
            await _exchangeInboxViewModel.OnViewAppearAsync();
        }
    }
}