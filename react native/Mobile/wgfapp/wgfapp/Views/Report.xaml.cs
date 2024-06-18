using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Report : ContentPage
    {
        private readonly ReportViewModel _reportViewModel;
        public Report(ReportViewModel reportViewModel)
        {
            InitializeComponent();
            _reportViewModel = reportViewModel;
            BindingContext = _reportViewModel;
        }
    }
}