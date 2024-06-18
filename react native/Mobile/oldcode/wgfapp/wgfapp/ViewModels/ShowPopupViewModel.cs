using System;
using System.Collections.Generic;
using System.Text;
using wgfapp.Interfaces;

namespace wgfapp.ViewModels
{
    public class ShowPopupViewModel : BasePopupViewModel
    {
        private string _source;

        public string Source
        {
            get { return _source; }
            set { SetProperty(ref _source, value); }
        }

        public ShowPopupViewModel(INavigationService navigationService) : base(navigationService)
        {
        }

        public void SetTitleAndSource(string pageName)
        {
            if(pageName == "RecvHudl")
            {
                PopupTitle = "Receive Hudl Exchange";
                Source = "https://www.hudl.com/support/v3/review-and-share-video/share-video/share-video-with-a-non-hudl-team";
            }
            else
            {
                PopupTitle = "Help";
                Source = "https://help.watchgamefilm.com/";
            }
        }
    }
}
