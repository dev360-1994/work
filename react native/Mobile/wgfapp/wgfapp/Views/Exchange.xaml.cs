using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Exchange : ContentPage
    {
        private readonly ExchangeViewModel _exchangeViewModel;

        public Exchange(ExchangeViewModel exchangeViewModel)
        {
            InitializeComponent();
            _exchangeViewModel = exchangeViewModel;
            BindingContext = _exchangeViewModel;
        }

        protected async override void OnAppearing()
        {
            base.OnAppearing();
            await _exchangeViewModel.OnViewAppearAsync();
        }
    }
}