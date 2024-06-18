using Rg.Plugins.Popup.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class ManagePlaylist : ContentPage
    {
        private readonly ManagePlaylistViewModel _managePlaylistViewModel;
        public ManagePlaylist(ManagePlaylistViewModel managePlaylistViewModel)
        {
            InitializeComponent();
            _managePlaylistViewModel = managePlaylistViewModel;
            BindingContext = _managePlaylistViewModel;
        }
    }
}