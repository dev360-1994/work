using wgfapp.Common.Models;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class ViewFilm : Xamarin.Forms.TabbedPage
    {
        private readonly ViewFilmViewModel _viewFilmViewModel;

        public ViewFilm(ViewFilmViewModel viewFilmViewModel, FilmTeamPlaylist playlist = null)
        {
            DevExpress.XamarinForms.DataGrid.Initializer.Init();
            InitializeComponent();

            _viewFilmViewModel = viewFilmViewModel;
            _viewFilmViewModel.SetPlaylistInfo(playlist);

            BindingContext = _viewFilmViewModel;
        }


        public FilmTeamPlaylist Playlist;
        

        protected override void OnAppearing()
        {
            MessagingCenter.Subscribe<ViewFilmViewModel, int>(this, "SetActiveTab", (sender, index) => {
                CurrentPage = Children[index];
            });
            base.OnAppearing();
            _viewFilmViewModel.OnViewAppear();
        }

        protected override void OnDisappearing()
        {
            MessagingCenter.Unsubscribe<ViewFilmViewModel>(this, "SetActiveTab");
        }



        //public class Card
        //{
        //    public string Order { get; set; }
        //    public string QDK { get; set; }

        //    public string ODK { get; set; }
        //    public string Result { get; set; }
        //}
    }
}