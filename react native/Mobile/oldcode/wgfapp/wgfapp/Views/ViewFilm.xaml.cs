using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class ViewFilm : ContentPage
    {
        private readonly ViewFilmViewModel _viewFilmViewModel;
        public ViewFilm(ViewFilmViewModel viewFilmViewModel)
        {
            InitializeComponent();
            _viewFilmViewModel = viewFilmViewModel;
            BindingContext = _viewFilmViewModel;
        }
    }
}