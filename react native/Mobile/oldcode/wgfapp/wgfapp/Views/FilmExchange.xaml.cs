using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class FilmExchange : ContentPage
    {
        private readonly FilmExchangeViewModel _filmExchangeViewModel;

        public FilmExchange(FilmExchangeViewModel filmExchangeViewModel)
        {
            InitializeComponent();
            _filmExchangeViewModel = filmExchangeViewModel;
            BindingContext = _filmExchangeViewModel;
        }
    }
}