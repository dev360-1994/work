using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using wgfapp.Enums;

namespace wgfapp.Interfaces
{
    public interface INavigationService
    {
        PageKey CurrentPageKey { get; }

        Task NavigateToFirstScreenAsync();

        Task NavigateToAsync(PageKey pageKey, Dictionary<string, object> parameters = null, bool isAnimated = false);

        Task NavigateAsModalPopupAsync(PageKey pageKey, Dictionary<string, object> parameters = null, bool isAnimated = false);

        void NavigateAsDetailPageOfMasterPage(PageKey pageKey, Dictionary<string, object> parameters = null, bool isAnimated = false);

        Task PushPopupAsync(PageKey pageKey, Dictionary<string, object> parameters = null, bool isAnimated = false);

        Task PopToRootAsync();

        Task GoBackAsync(int numberOfPagesToSkip = 0);

        Task GoBackToPageAsync(PageKey pageKey);

        Task PopModalAsync();

        Task PopPopupAsync(bool isAnimate = true);

        void PresentMenuView();
    }
}
