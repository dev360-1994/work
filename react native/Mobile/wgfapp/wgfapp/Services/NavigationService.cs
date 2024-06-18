using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Rg.Plugins.Popup.Contracts;
using Rg.Plugins.Popup.Pages;
using Rg.Plugins.Popup.Services;
using Unity.Resolution;
using wgfapp.Common;
using wgfapp.Enums;
using wgfapp.Interfaces;
using wgfapp.Views;
using Xamarin.Forms;

namespace wgfapp.Services
{
    public class NavigationService : INavigationService
    {
        private readonly IPersistanceService _persistanceService;
        private readonly Dictionary<Type, PageKey> _pages;
        private readonly IPopupNavigation _popupNavigation;

        private MasterDetailPage _masterDetailPage;
        private NavigationPage _navigation;

        public NavigationService(IPersistanceService persistanceService)
        {
            _persistanceService = persistanceService;
            _pages = new Dictionary<Type, PageKey>();
            _popupNavigation = PopupNavigation.Instance;
        }

        public PageKey CurrentPageKey => _pages[_navigation.CurrentPage.GetType()];

        public async Task NavigateToFirstScreenAsync()
        {
            if (_persistanceService.IsLoggedIn)
                await NavigateToAsync(PageKey.MainPage);
            else
                await NavigateToAsync(PageKey.Login);
        }

        public async Task NavigateToAsync(PageKey pageKey, Dictionary<string, object> parameters = null, bool isAnimated = false)
        {
            Page page = GetPage(pageKey, parameters);
            if (pageKey == PageKey.Login || pageKey == PageKey.MainPage)
            {
                _navigation = new NavigationPage(page)
                {
                    BarTextColor = Color.White,
                };

                _navigation.SetDynamicResource(NavigationPage.StyleProperty, "NavigationBarStyle");

                Application.Current.MainPage = _navigation;
            }
            else
            {
                await _navigation.PushAsync(page, isAnimated);
            }
        }

        public async Task NavigateAsModalPopupAsync(PageKey pageKey, Dictionary<string, object> parameters = null, bool isAnimated = false)
        {
            Page page = GetPage(pageKey, parameters);
            await _navigation.Navigation.PushModalAsync(page, isAnimated);
        }

        public void NavigateAsDetailPageOfMasterPage(PageKey pageKey, Dictionary<string, object> parameters = null, bool isAnimated = false)
        {
            if (_masterDetailPage == null)
                return;

            Page page = GetPage(pageKey, parameters);
            _masterDetailPage.Detail = new NavigationPage(page);
            _masterDetailPage.IsPresented = false;
        }

        public async Task PushPopupAsync(PageKey pageKey, Dictionary<string, object> parameters = null, bool isAnimated = false)
        {
            PopupPage page = GetPopupPage(pageKey, parameters);
            await _popupNavigation.PushAsync(page, true);
        }

        public async Task GoBackAsync(int numberOfPagesToSkip = 0)
        {
            IReadOnlyList<Page> navigationStack = _navigation.Navigation.NavigationStack;
            while (numberOfPagesToSkip > 0)
            {
                _navigation.Navigation.RemovePage(navigationStack[navigationStack.Count - 2]);
                numberOfPagesToSkip--;
            }

            await _navigation.PopAsync();
        }

        public async Task GoBackToPageAsync(PageKey pageKey)
        {
            IReadOnlyList<Page> navigationStack = _navigation.Navigation.NavigationStack;

            var numberOfPagesToSkip = 0;

            if (navigationStack.Count > 2)
            {
                var startIndex = navigationStack.Count - 2;

                for (var i = startIndex; i >= 0; i--)
                {
                    var page = navigationStack[i];

                    var pageType = _pages.First(x => x.Value == pageKey).Key;

                    if (page.GetType() == pageType)
                    {
                        numberOfPagesToSkip = startIndex - i;
                        break;
                    }
                }
            }

            await GoBackAsync(numberOfPagesToSkip);
        }

        public async Task PopToRootAsync()
        {
            await _navigation.PopToRootAsync(true);
        }

        public async Task PopModalAsync()
        {
            await _navigation.Navigation.PopModalAsync();
        }

        public async Task PopPopupAsync(bool isAnimate = true)
        {
            await _popupNavigation.PopAsync(isAnimate);
        }

        public void PresentMenuView()
        {
            if (_masterDetailPage != null)
            {
                _masterDetailPage.IsPresented = !_masterDetailPage.IsPresented;
            }
        }

        private Page GetPage(PageKey pageKey, Dictionary<string, object> parameters = null)
        {
            Page page;
            ResolverOverride[] resolverOverrides = null;
            if (parameters != null && parameters.Count() > 0)
            {
                resolverOverrides = new ResolverOverride[parameters.Count()];
                for (int i = 0; i < parameters.Count(); i++)
                {
                    var dictionaryItem = parameters.ElementAt(i);
                    resolverOverrides[i] = new ParameterOverride(dictionaryItem.Key, dictionaryItem.Value);
                }
            }

            switch (pageKey)
            {
                case PageKey.Login:
                    page = (TabbedPage)ContainerManager.Container.Resolve(typeof(Login), typeof(Login).ToString());
                    break;
                case PageKey.MainPage:
                    _masterDetailPage = (MasterDetailPage)ContainerManager.Container.Resolve(typeof(MainPage), typeof(MainPage).ToString());
                    var dashboard = (ContentPage)ContainerManager.Container.Resolve(typeof(Dashboard), typeof(Dashboard).ToString());
                    _masterDetailPage.Detail = new NavigationPage(dashboard);
                    page = _masterDetailPage;
                    break;
                case PageKey.Dashboard:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(Dashboard), typeof(Dashboard).ToString());
                    break;
                case PageKey.AddLocker:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(AddLocker), typeof(AddLocker).ToString());
                    break;
                case PageKey.Calendar:
                    page = (TabbedPage)ContainerManager.Container.Resolve(typeof(Calendar), typeof(Calendar).ToString());
                    break;
                case PageKey.Connect:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(Connect), typeof(Connect).ToString());
                    break;
                case PageKey.ContactLeagueTeam:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(ContactLeagueTeam), typeof(ContactLeagueTeam).ToString());
                    break;
                case PageKey.ContactUs:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(ContactUs), typeof(ContactUs).ToString());
                    break;
                case PageKey.Documentation:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(Documentation), typeof(Documentation).ToString());
                    break;
                case PageKey.Documents:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(Documents), typeof(Documents).ToString());
                    break;
                case PageKey.Exchange:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(Exchange), typeof(Exchange).ToString());
                    break;
                case PageKey.ExchangeInbox:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(ExchangeInbox), typeof(ExchangeInbox).ToString());
                    break;
                case PageKey.ExchangeHistory:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(ExchangeHistory), typeof(ExchangeHistory).ToString());
                    break;
                case PageKey.Faq:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(Faq), typeof(Faq).ToString());
                    break;
                case PageKey.FilmExchange:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(FilmExchange), typeof(FilmExchange).ToString());
                    break;
                case PageKey.ForgotPassword:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(ForgotPassword), typeof(ForgotPassword).ToString());
                    break;
                case PageKey.GetLocker:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(GetLocker), typeof(GetLocker).ToString());
                    break;
                case PageKey.HightLights:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(Highlights), typeof(Highlights).ToString());
                    break;
                case PageKey.History:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(History), typeof(History).ToString());
                    break;
                case PageKey.LeagueExchange:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(LeagueExchange), typeof(LeagueExchange).ToString());
                    break;
                case PageKey.LearningVideos:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(LearningVideos), typeof(LearningVideos).ToString());
                    break;
                case PageKey.LiveStream:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(LiveStream), typeof(LiveStream).ToString());
                    break;
                case PageKey.ManageAppointment:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(ManageAppointment), typeof(ManageAppointment).ToString(), resolverOverrides);
                    break;
                case PageKey.ManagePlaylist:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(ManagePlaylist), typeof(ManagePlaylist).ToString());
                    break;
                case PageKey.ManageUser:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(ManageUser), typeof(ManageUser).ToString());
                    break;
                case PageKey.Messenger:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(Messenger), typeof(Messenger).ToString());
                    break;
                case PageKey.NewUser:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(NewUser), typeof(NewUser).ToString());
                    break;
                case PageKey.OpenExchange:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(OpenExchange), typeof(OpenExchange).ToString());
                    break;
                case PageKey.Payment:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(Payment), typeof(Payment).ToString());
                    break;
                case PageKey.Photos:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(Photos), typeof(Photos).ToString());
                    break;
                case PageKey.Playbook:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(Playbook), typeof(Playbook).ToString());
                    break;
                case PageKey.Playlists:
                    page = (TabbedPage)ContainerManager.Container.Resolve(typeof(Playlists), typeof(Playlists).ToString());
                    break;
                case PageKey.Practice:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(Practice), typeof(Practice).ToString());
                    break;
                case PageKey.Profile:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(Profiles), typeof(Profiles).ToString());
                    break;
                case PageKey.RecycleBin:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(RecyleBin), typeof(RecyleBin).ToString());
                    break;
                case PageKey.Report:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(Report), typeof(Report).ToString());
                    break;
                case PageKey.ResetPassword:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(ResetPassword), typeof(ResetPassword).ToString());
                    break;
                case PageKey.Security:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(Security), typeof(Security).ToString());
                    break;
                case PageKey.Statistics:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(Statistics), typeof(Statistics).ToString());
                    break;
                case PageKey.TeamExchange:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(TeamExchange), typeof(TeamExchange).ToString());
                    break;
                case PageKey.Upload:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(Upload), typeof(Upload).ToString());
                    break;
                case PageKey.Users:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(Users), typeof(Users).ToString());
                    break;
                case PageKey.ViewFilm:
                    page = (TabbedPage)ContainerManager.Container.Resolve(typeof(ViewFilm), typeof(ViewFilm).ToString(), resolverOverrides);
                    break;
                case PageKey.UploadTemplate:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(UploadTemplate), typeof(UploadTemplate).ToString());
                    break;

                case PageKey.ViewLibrary:
                    page = (ContentPage)ContainerManager.Container.Resolve(typeof(ViewLibrary), typeof(ViewLibrary).ToString());
                    break;
                default:
                    throw new ArgumentException(
                        $"No such page: {pageKey}. Did you forget to call NavigationService.Configure?", nameof(pageKey));
            }

            if (!_pages.ContainsKey(page.GetType()))
                _pages.Add(page.GetType(), pageKey);

            return page;
        }

        private PopupPage GetPopupPage(PageKey pageKey, Dictionary<string, object> parameters = null)
        {
            PopupPage page;
            ResolverOverride[] resolverOverrides = null;
            if (parameters != null && parameters.Count() > 0)
            {
                resolverOverrides = new ResolverOverride[parameters.Count()];
                for (int i = 0; i < parameters.Count(); i++)
                {
                    var dictionaryItem = parameters.ElementAt(i);
                    resolverOverrides[i] = new ParameterOverride(dictionaryItem.Key, dictionaryItem.Value);
                }
            }

            switch (pageKey)
            {
                case PageKey.HelpPopup:
                    page = (PopupPage)ContainerManager.Container.Resolve(typeof(ShowPopup), typeof(ShowPopup).ToString(), resolverOverrides);
                    break;
                case PageKey.AddLockerPopup:
                    page = (PopupPage)ContainerManager.Container.Resolve(typeof(AddLockerPopup), typeof(AddLockerPopup).ToString(), resolverOverrides);
                    break;
                case PageKey.ExchangeInboxPopup:
                    page = (PopupPage)ContainerManager.Container.Resolve(typeof(ExchangeInboxPopUp), typeof(ExchangeInboxPopUp).ToString(), resolverOverrides);
                    break;
                case PageKey.GetLockerPopup:
                    page = (PopupPage)ContainerManager.Container.Resolve(typeof(GetLockerPopup), typeof(GetLockerPopup).ToString(), resolverOverrides);
                    break;
                case PageKey.LeagueExchangePopup:
                    page = (PopupPage)ContainerManager.Container.Resolve(typeof(LeagueExchangePopup), typeof(LeagueExchangePopup).ToString(), resolverOverrides);
                    break;
                case PageKey.OpenExchangePopup:
                    page = (PopupPage)ContainerManager.Container.Resolve(typeof(OpenExchangePopup), typeof(OpenExchangePopup).ToString(), resolverOverrides);
                    break;
                case PageKey.TeamExchangePopup:
                    page = (PopupPage)ContainerManager.Container.Resolve(typeof(TeamExchangePopup), typeof(TeamExchangePopup).ToString(), resolverOverrides);
                    break;
                case PageKey.UploadTemplate:
                    page = (PopupPage)ContainerManager.Container.Resolve(typeof(UploadTemplate), typeof(UploadTemplate).ToString(), resolverOverrides);
                    break;
                case PageKey.ViewLibrary:
                    page = (PopupPage)ContainerManager.Container.Resolve(typeof(ViewLibrary), typeof(ViewLibrary).ToString(), resolverOverrides);
                    break;
                default:
                    throw new ArgumentException(
                        $"No such popup page: {pageKey}. Did you forget to call NavigationService.Configure?", nameof(pageKey));
            }

            if (!_pages.ContainsKey(page.GetType()))
                _pages.Add(page.GetType(), pageKey);

            return page;
        }
    }
}
