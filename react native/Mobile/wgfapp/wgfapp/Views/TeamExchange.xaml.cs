using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class TeamExchange : ContentPage
    {
        private readonly TeamExchangeViewModel _teamExchangeViewModel;
        public TeamExchange(TeamExchangeViewModel teamExchangeViewModel)
        {
            InitializeComponent();
            _teamExchangeViewModel = teamExchangeViewModel;
            BindingContext = _teamExchangeViewModel;
        }
    }
}