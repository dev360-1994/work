using wgfapp.Services;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Practice : ContentPage
    {
        private readonly PracticeViewModel _practiceViewModel;

       public Practice(PracticeViewModel practiceViewModel)
        {
            InitializeComponent();
            _practiceViewModel = practiceViewModel;
            BindingContext = _practiceViewModel;

            
        }

        protected async override void OnAppearing()
        {
            base.OnAppearing();
            await _practiceViewModel.OnViewAppearAsync();
            Webview.Reload();
        }
    }
}