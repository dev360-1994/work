using System.ComponentModel;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Documentation : ContentPage
    {
        private readonly DocumentationViewModel _documentationViewModel;

        public Documentation(DocumentationViewModel documentationViewModel)
        {
            InitializeComponent();
            _documentationViewModel = documentationViewModel;
            BindingContext = _documentationViewModel;

            var w = new WebView() { Source = "https://help.watchgamefilm.com/" };
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