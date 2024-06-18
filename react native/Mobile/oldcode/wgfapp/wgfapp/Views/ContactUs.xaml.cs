using System.ComponentModel;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class ContactUs : ContentPage
    {
        private readonly ContactUsViewModel _contactUsViewModel;

        public ContactUs(ContactUsViewModel contactUsViewModel)
        {
            InitializeComponent();
            _contactUsViewModel = contactUsViewModel;
            BindingContext = _contactUsViewModel;
            var w = new WebView() { Source = "https://help.watchgamefilm.com/contact" };
            w.PropertyChanged += w_PropertyChanged;
            Content = w;
        }

        void w_PropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            if (e.PropertyName == "Source")
            {
                var contentWebView = sender as WebView;
                var o = contentWebView.Source as UrlWebViewSource;

            }
        }

    }
}