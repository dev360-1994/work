using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Dashboard : ContentPage
    {
        private readonly DashboardViewModel _dashboardViewModel;

        public Dashboard(DashboardViewModel dashboardViewModel)
        {
            InitializeComponent();
            _dashboardViewModel = dashboardViewModel;
            BindingContext = _dashboardViewModel;
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();
            _dashboardViewModel.OnViewAppear();
        }

        private void BtnDropdown_Clicked(System.Object sender, System.EventArgs e)
        {
            PCTitle.Focus();
        }
    }
}