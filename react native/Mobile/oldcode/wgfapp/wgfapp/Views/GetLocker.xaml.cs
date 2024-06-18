using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class GetLocker : ContentPage
    {
        private readonly GetLockerViewModel _getLockerViewModel;

        public GetLocker(GetLockerViewModel getLockerViewModel)
        {
            InitializeComponent();
            _getLockerViewModel = getLockerViewModel;
            BindingContext = _getLockerViewModel;
        }
    }
}