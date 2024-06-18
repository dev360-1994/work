using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;
using wgfapp.Models;

namespace wgfapp.ViewModels
{
    public class StatisticsListViewModel
    {
        readonly StatisticsListData data;

        public event PropertyChangedEventHandler PropertyChanged;
        public IReadOnlyList<StatisticsList> Statisticslists { get => data.StatisticsLists; }

        public StatisticsListViewModel()
        {
            data = new StatisticsListData();
        }

        protected void RaisePropertyChanged(string name)
        {
            if (PropertyChanged != null)
                PropertyChanged(this, new PropertyChangedEventArgs(name));
        }
    }
}
