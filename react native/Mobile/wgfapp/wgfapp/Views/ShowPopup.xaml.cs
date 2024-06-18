using Rg.Plugins.Popup.Pages;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class ShowPopup : PopupPage
    {
        private readonly ShowPopupViewModel _showPopupViewModel;

        public ShowPopup(string pageName, ShowPopupViewModel showPopupViewModel)
        {
            InitializeComponent();
            _showPopupViewModel = showPopupViewModel;
            BindingContext = _showPopupViewModel;
            _showPopupViewModel.SetTitleAndSource(pageName);
        }

        protected async override void OnAppearing()
        {
            base.OnAppearing();
            await progress.ProgressTo(0.9, 900, Easing.SpringIn);
        }

        protected void OnNavigating(object sender, WebNavigatingEventArgs e)
        {
            progress.IsVisible = true;
        }

        protected void OnNavigated(object sender, WebNavigatedEventArgs e)
        {
            progress.IsVisible = false;
        }
    }
}