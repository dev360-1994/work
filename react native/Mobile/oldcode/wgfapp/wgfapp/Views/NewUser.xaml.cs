using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class NewUser : ContentPage
    {
        private readonly NewUserViewModel _newUserViewModel;
        public NewUser(NewUserViewModel newUserViewModel)
        {
            InitializeComponent();
            _newUserViewModel = newUserViewModel;
            BindingContext = _newUserViewModel;
        }
    }
}