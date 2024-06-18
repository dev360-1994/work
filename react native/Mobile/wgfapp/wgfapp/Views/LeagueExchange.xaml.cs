using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class LeagueExchange : ContentPage
    {
        private readonly LeagueExchangeViewModel _leagueExchangeViewModel;

        public LeagueExchange(LeagueExchangeViewModel leagueExchangeViewModel)
        {
            InitializeComponent();
            _leagueExchangeViewModel = leagueExchangeViewModel;
            BindingContext = _leagueExchangeViewModel;
        }
    }
}