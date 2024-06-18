using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Statistics : ContentPage
    {
        private readonly StatisticsViewModel _statisticsViewModel;
        public Statistics(StatisticsViewModel statisticsViewModel)
        {
            InitializeComponent();
            _statisticsViewModel = statisticsViewModel;
            BindingContext = _statisticsViewModel;
        }
    }
}