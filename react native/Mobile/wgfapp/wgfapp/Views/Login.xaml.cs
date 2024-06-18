using wgfapp.ViewModels;
using Xamarin.Forms.PlatformConfiguration;
using Xamarin.Forms.PlatformConfiguration.AndroidSpecific;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Login : Xamarin.Forms.TabbedPage
    {
        private readonly LoginViewModel _loginViewModel;

        public Login(LoginViewModel loginViewModel)
        {
            _loginViewModel = loginViewModel;
            InitializeComponent();
            BindingContext = _loginViewModel;

            // Android setting to put tabbar at bottom.
            On<Android>().SetToolbarPlacement(ToolbarPlacement.Bottom);
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();
            _loginViewModel.OnViewAppear();
            username.Text = string.Empty;
            password.Text = string.Empty;
            username.Focus();
        }
    }
}