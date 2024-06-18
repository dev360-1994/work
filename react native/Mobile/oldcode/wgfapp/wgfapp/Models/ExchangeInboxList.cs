using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using wgfapp.Enums;

namespace wgfapp.Models
{
    public class ExchangeInboxList
    {
        public string Title { get; set; }

        public string Icon { get; set; }

        public string Color { get; set; }

        public PageKey PageKey { get; set; }
    }

    public class ExchangeInboxListData
    {
        void GenerateExchangeInboxList()
        {
            ObservableCollection<ExchangeInboxList> result = new ObservableCollection<ExchangeInboxList>();
            result.Add(
                new ExchangeInboxList()
                {
                    Title = "Exchange Inbox",
                    Icon = "ic_album",
                    Color = "#FF0000",
                    PageKey = PageKey.ExchangeInbox,
                });
            result.Add(
                new ExchangeInboxList()
                {
                    Title = "Exchange History",
                    Icon = "ic_email",
                    Color = "#00FF00",
                    PageKey = PageKey.ExchangeHistory,
                }
            );
            result.Add(
                new ExchangeInboxList()
                {
                    Title = "Add to Locker",
                    Icon = "ic_expand",
                    Color = "#0000FF",
                    PageKey = PageKey.AddLocker
                }
            );
            result.Add(
                new ExchangeInboxList()
                {
                    Title = "Get from Locker",
                    Icon = "ic_cal_today",
                    Color = "#FFFF00",
                    PageKey = PageKey.GetLocker
                }
            );
            result.Add(
                new ExchangeInboxList()
                {
                    Title = "League Exchange",
                    Icon = "ic_cal_week",
                    Color = "#FF00FF",
                    PageKey = PageKey.LeagueExchange
                }
            );
            result.Add(
                new ExchangeInboxList()
                {
                    Title = "Contact League Team",
                    Icon = "ic_cal_month",
                    Color = "#FFF00F",
                    PageKey = PageKey.ContactLeagueTeam
                }
            );
            result.Add(
               new ExchangeInboxList()
               {
                   Title = "Team Exchange",
                   Icon = "ic_credit_card",
                   Color = "#FF1122",
                   PageKey = PageKey.TeamExchange
               }
           );
            result.Add(
                new ExchangeInboxList()
                {
                    Title = "Open Exchange",
                    Icon = "ic_refresh",
                    Color = "#FF2233",
                    PageKey = PageKey.OpenExchange,
                }
            );
            result.Add(
                new ExchangeInboxList()
                {
                    Title = "Receive Hudl Exchange",
                    Icon = "ic_tv",
                    Color = "#FF4455",
                    PageKey = PageKey.HelpPopup
                }
            );
            ExchangeInboxLists = result;
        }


        public ObservableCollection<ExchangeInboxList> ExchangeInboxLists { get; private set; }

        public ExchangeInboxListData()
        {
            GenerateExchangeInboxList();
        }
    }
}
