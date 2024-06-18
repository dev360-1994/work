using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Security : ContentPage
    {
        private readonly SecurityViewModel _securityViewModel;
        public Security(SecurityViewModel securityViewModel)
        {
            InitializeComponent();
            _securityViewModel = securityViewModel;
            BindingContext = _securityViewModel;
        }
    }
}