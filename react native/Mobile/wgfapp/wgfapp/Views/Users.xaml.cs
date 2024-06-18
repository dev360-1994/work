using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Users : ContentPage
    {
        private readonly UsersViewModel _usersViewModel;
        public Users(UsersViewModel usersViewModel)
        {
            InitializeComponent();
            _usersViewModel = usersViewModel;
            BindingContext = _usersViewModel;
        }

        protected async override void OnAppearing()
        {
            base.OnAppearing();
            await _usersViewModel.OnViewAppearAsync();


        }
    }
}