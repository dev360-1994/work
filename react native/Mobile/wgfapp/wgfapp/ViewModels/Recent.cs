using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Input;
using Acr.UserDialogs;
using wgfapp.BootstrapIcons;
using wgfapp.Common.Models;
using wgfapp.Interfaces;
using wgfapp.Messages;
using wgfapp.Service.Interfaces;
using Xamarin.Forms;
using wgfapp.Enums;

namespace wgfapp.ViewModels
{
    public class Recent : BaseViewModel
    {
        private readonly IPersistanceService _persistanceService;
        private readonly IPlaylistService playlistService;
        public async void OnViewAppear()
        {
            UserDialogs.Instance.ShowLoading("Loading...");
      
            var result = await playlistService.GetTeamPlaylists(_persistanceService.UserInfo.TeamId, _persistanceService.UserInfo.UserId, "R", _persistanceService.Token);
            UserDialogs.Instance.HideLoading();
        }
    }
}
