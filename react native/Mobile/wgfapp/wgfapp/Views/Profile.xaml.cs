using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Profiles : ContentPage
    {
        private readonly ProfileViewModel _profileViewModel;
        public Profiles(ProfileViewModel profileViewModel)
        {
            InitializeComponent();
            _profileViewModel = profileViewModel;
            BindingContext = _profileViewModel;
        }

        protected async override void OnAppearing()
        {
            base.OnAppearing();
            await _profileViewModel.OnViewAppearAsync();
        }
    }
}