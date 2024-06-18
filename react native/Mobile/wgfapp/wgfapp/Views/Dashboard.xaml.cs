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
            PCTeams.Focus();
        }

        void ToolbarItem_Clicked(System.Object sender, System.EventArgs e)
        {
            //Xam.Plugin.SimpleColorPicker.ColorDialogSettings colorDialogSettings = new Xam.Plugin.SimpleColorPicker.ColorDialogSettings()
            //{

            //};
            //Xam.Plugin.SimpleColorPicker.ColorPickerDialog.Show(MainGrid, "Select Color", Color.FromHex("#FF000000"));
        }
    }
}