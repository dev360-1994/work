using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;
using System.Windows.Input;
using wgfapp.Interfaces;
using wgfapp.Models;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class PlayListDataViewModel : INotifyPropertyChanged
    {
        readonly PlayListData data;

        public event PropertyChangedEventHandler PropertyChanged;
        public IReadOnlyList<PlayList> Playlists { get => data.PlayLists; }

        public PlayListDataViewModel()
        {
            data = new PlayListData();
        }

    }
}
