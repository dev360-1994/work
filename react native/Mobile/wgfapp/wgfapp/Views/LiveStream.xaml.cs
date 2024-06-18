using System;
using MediaManager;
using Rg.Plugins.Popup.Services;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class LiveStream : ContentPage
    {
        private readonly LiveStreamViewModel _liveStreamViewModel;

        public LiveStream(LiveStreamViewModel liveStreamViewModel)
        {
            InitializeComponent();
            _liveStreamViewModel = liveStreamViewModel;
            BindingContext = _liveStreamViewModel;
            CrossMediaManager.Current.StateChanged += Current_StateChanged;
        }

        private void Current_StateChanged(object sender, MediaManager.Playback.StateChangedEventArgs e)
        {
            if (e.State == MediaManager.Player.MediaPlayerState.Playing && _liveStreamViewModel != null)
                _liveStreamViewModel.IsLoading = false;
        }

        private void OnPlayPauseButtonClicked(object sender, EventArgs args)
        {
            if (videoPlayer.State == MediaManager.Player.MediaPlayerState.Playing)
                CrossMediaManager.Current.Pause();
            else if (videoPlayer.State ==MediaManager.Player.MediaPlayerState.Paused)
                CrossMediaManager.Current.PlayPause();
        }

        private void OnStopButtonClicked(object sender, EventArgs args)
        {
            CrossMediaManager.Current.Stop();
        }
    }
}