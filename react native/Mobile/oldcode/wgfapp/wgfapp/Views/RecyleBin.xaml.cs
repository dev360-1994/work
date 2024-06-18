using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class RecyleBin : ContentPage
    {
        private readonly RecyleBinViewModel _recyleBinViewModel;
        public RecyleBin(RecyleBinViewModel recyleBinViewModel)
        {
            InitializeComponent();
            _recyleBinViewModel = recyleBinViewModel;
            BindingContext = _recyleBinViewModel;
        }
    }
}