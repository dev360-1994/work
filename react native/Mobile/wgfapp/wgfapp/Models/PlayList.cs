using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using Xamarin.Forms;

namespace wgfapp.Models
{
    public class PlayList
    {
        public string Title { get; set; }
        public string Name { get; set; }
       
    }

    public class PlayListData
    {
        void GeneratePlayLists()
        {
            ObservableCollection<PlayList> result = new ObservableCollection<PlayList>();
            result.Add(
                new PlayList()
                {
                    Title = "Game 1",
                    Name = "(206) 555-9857"
                });
            result.Add(
                new PlayList()
                {
                    Title = "Game 2",
                    Name = "(206) 555-9482",
                }
            );
            result.Add(
                new PlayList()
                {
                    Title = "Game 3",
                    Name = "(206) 555-3412",
                }
            );
            result.Add(
                new PlayList()
                {
                    Title = "Game 4",
                    Name = "(206) 555-8122",
                }
            );
            result.Add(
                new PlayList()
                {
                    Title = "Game 5",
                    Name = "(71) 555-4848",
                                   }
            );
            result.Add(
                new PlayList()
                {
                    Title = "Game 6",
                    Name = "(71) 555-7773",
                }
            );
            
            PlayLists = result;
        }

        public ObservableCollection<PlayList> PlayLists { get; private set; }

        public PlayListData()
        {
            GeneratePlayLists();
        }
    }
}
