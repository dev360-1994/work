using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Photos : ContentPage
    {
        private readonly PhotosViewModel _photosViewModel;
        public Photos(PhotosViewModel photosViewModel)
        {
            InitializeComponent();
            _photosViewModel = photosViewModel;
            BindingContext = _photosViewModel;
        }
    }
}