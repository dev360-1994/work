using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class ExchangeHistory : ContentPage
    {
        private readonly ExchangeHistoryViewModel _exchangeHistoryViewModel;

        public ExchangeHistory(ExchangeHistoryViewModel exchangeHistoryViewModel)
        {
            InitializeComponent();
            _exchangeHistoryViewModel = exchangeHistoryViewModel;
            BindingContext = _exchangeHistoryViewModel;
        }

        protected async override void OnAppearing()
        {
            base.OnAppearing();
            await _exchangeHistoryViewModel.OnViewAppearAsync();
        }
    }
}