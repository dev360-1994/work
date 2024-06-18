using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class ResetPassword : ContentPage
    {
        private readonly ResetPasswordViewModel _resetPasswordViewModel;
        public ResetPassword(ResetPasswordViewModel resetPasswordViewModel)
        {
            InitializeComponent();
            _resetPasswordViewModel = resetPasswordViewModel;
            BindingContext = _resetPasswordViewModel;
        }
    }
}