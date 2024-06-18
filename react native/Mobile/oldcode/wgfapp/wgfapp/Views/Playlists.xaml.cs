using wgfapp.ViewModels;
using Xamarin.Forms.PlatformConfiguration.AndroidSpecific;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Playlists : Xamarin.Forms.TabbedPage
    {
        private readonly PlaylistsViewModel _playlistsViewModel;
        public Playlists(PlaylistsViewModel playlistsViewModel)
        {
            InitializeComponent();
            _playlistsViewModel = playlistsViewModel;
            BindingContext = _playlistsViewModel;
            this.On<Xamarin.Forms.PlatformConfiguration.Android>().SetIsSwipePagingEnabled(false);
        }
    }
}