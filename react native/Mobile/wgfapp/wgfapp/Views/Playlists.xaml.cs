using System.Collections.Generic;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.PlatformConfiguration.AndroidSpecific;
using Xamarin.Forms.Xaml;
using wgfapp.Common.Models;

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
        protected override void OnAppearing()
        {
            base.OnAppearing();
            _playlistsViewModel.OnViewAppear();
        }

        void OnCheckBoxCheckedChanged(object sender, CheckedChangedEventArgs e)
        {

            CheckBox cb = (CheckBox)sender;
            var item = (FilmTeamPlaylist)cb.BindingContext;
           if (item != null)
           {
                _playlistsViewModel.CheckedChange(item, cb.IsChecked);
            }

        }

        //        public partial class TestPage : ContentPage
        //{
        //    TestPageViewModel viewModel;
        //    public TestPage()
        //    {
        //        InitializeComponent();

        //        viewModel = new TestPageViewModel();
        //        BindingContext = viewModel;
        //    }

        //    private void CheckBox_CheckedChanged(object sender, CheckedChangedEventArgs e)
        //    {
        //        var checkBox = sender as CheckBox;

        //        foreach (var item in viewModel.DataCollection)
        //        {
        //            item.IsSelected = e.Value;
        //        }
        //    }
        //}
        //public async Task<JsonResult> OnPutFavoriteStatusUpdate([FromBody] PlaylistFavoriteResource favoriteStatus)
        //{
        //    var playlistToUpdate = _mapper.Map<PlaylistFavoriteResource, PlaylistFavoriteStatus>(favoriteStatus);
        //    var updatedPlaylist = await _playlistService.UpdatePlaylistFavoriteStatus(playlistToUpdate);
        //    return new JsonResult(updatedPlaylist);
        //}
    }
}