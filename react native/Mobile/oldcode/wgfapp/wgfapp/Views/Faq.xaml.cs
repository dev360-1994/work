using System.ComponentModel;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Faq : ContentPage
    {
        private readonly FaqViewModel _faqViewModel;

        public Faq(FaqViewModel faqViewModel)
        {
            InitializeComponent();
            _faqViewModel = faqViewModel;
            BindingContext = _faqViewModel;

            var w = new WebView() { Source = "https://help.watchgamefilm.com/articles/20931-frequently-asked-questions" };
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