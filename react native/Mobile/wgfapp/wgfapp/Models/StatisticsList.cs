using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;

namespace wgfapp.Models
{
    public class StatisticsList
    {
        public string Title { get; set; }
    }

    public class StatisticsListData
    {
        void GenerateStatisticsList()
        {
            ObservableCollection<StatisticsList> result = new ObservableCollection<StatisticsList>();
            result.Add(
                new StatisticsList()
                {
                    Title = "Game 1 vs Rattlesnakes"
                });
            result.Add(
                new StatisticsList()
                {
                    Title = "Game 2 vs Jaguars"
                }
            );
            result.Add(
                new StatisticsList()
                {
                    Title = "Game 3 vs Mustangs"
                }
            );
            result.Add(
                new StatisticsList()
                {
                    Title = "Game 4 vs Lions",
                }
            );
            result.Add(
                new StatisticsList()
                {
                    Title = "Wednesday Practice"
                }
            );
            result.Add(
                new StatisticsList()
                {
                    Title = "Eagles Scout Film"
                }
            );
            result.Add(
               new StatisticsList()
               {
                   Title = "Tigers vs Leopards Scout Film"
               }
           );
            result.Add(
                new StatisticsList()
                {
                    Title = "Monday Practice"
                }
            );
            result.Add(
             new StatisticsList()
             {
                 Title = "Jaguars vs Mustangs"
             }
         );
            result.Add(
                new StatisticsList()
                {
                    Title = "7 on 7 Tournament"
                }
            );
            StatisticsLists = result;
        }

        public ObservableCollection<StatisticsList> StatisticsLists { get; private set; }

        public StatisticsListData()
        {
            GenerateStatisticsList();
        }
    }
}
