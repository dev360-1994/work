using System;
using Unity;
using Unity.Lifetime;
using wgfapp.Common.Interfaces;
using wgfapp.Interfaces;
using wgfapp.Service.Implementation;
using wgfapp.Services;
using wgfapp.ViewModels;
using wgfapp.Views;

namespace wgfapp
{
    public class FormsBootstrapper
    {
        public static void Initialize(IUnityContainer container)
        {
            // Interface and Class Registration goes here.
            RegisterTypes(container);
            RegisterViewModels(container);
            RegisterViews(container);
        }

        private static void RegisterTypes(IUnityContainer container)
        {
            container.RegisterType<IConfig, Config>(new HierarchicalLifetimeManager());
            container.RegisterType<INavigationService, NavigationService>(new HierarchicalLifetimeManager());
            container.RegisterType<IMessagingService, MessagingService>(new HierarchicalLifetimeManager());
            container.RegisterType<IPersistanceService, PersistanceService>(new HierarchicalLifetimeManager());
            container.RegisterType<ISecureStorage, SecureStorageService>(new HierarchicalLifetimeManager());

        }

        private static void RegisterViewModels(IUnityContainer container)
        {
            container.RegisterType<MainViewModel>(new HierarchicalLifetimeManager());
            container.RegisterType<CalendarViewModel>(new TransientLifetimeManager());
            container.RegisterType<ExchangeInboxViewModel>(new TransientLifetimeManager());
            container.RegisterType<LiveStreamViewModel>(new TransientLifetimeManager());
            container.RegisterType<DashboardViewModel>(new TransientLifetimeManager());
            container.RegisterType<ManageAppointmentViewModel>(new TransientLifetimeManager());
            container.RegisterType<MenusGroupViewModel>(new TransientLifetimeManager());
            container.RegisterType<GroupedMenu>(new TransientLifetimeManager());
            container.RegisterType<PlayListDataViewModel>(new TransientLifetimeManager());
            container.RegisterType<StatisticsListViewModel>(new TransientLifetimeManager());
            container.RegisterType<AddLockerViewModel>(new TransientLifetimeManager());
            container.RegisterType<AddLockerPopupViewModel>(new TransientLifetimeManager());
            container.RegisterType<ConnectViewModel>(new TransientLifetimeManager());
            container.RegisterType<ContactLeagueTeamViewModel>(new TransientLifetimeManager());
            container.RegisterType<ContactUsViewModel>(new TransientLifetimeManager());
            container.RegisterType<DocumentationViewModel>(new TransientLifetimeManager());
            container.RegisterType<DocumentsViewModel>(new TransientLifetimeManager());
            container.RegisterType<ExchangeViewModel>(new TransientLifetimeManager());
            container.RegisterType<ExchangeHistoryViewModel>(new TransientLifetimeManager());
            container.RegisterType<ExchangeInboxPopUpViewModel>(new TransientLifetimeManager());
            container.RegisterType<FaqViewModel>(new TransientLifetimeManager());
            container.RegisterType<FilmExchangeViewModel>(new TransientLifetimeManager());
            container.RegisterType<GetLockerViewModel>(new TransientLifetimeManager());
            container.RegisterType<GetLockerPopupViewModel>(new TransientLifetimeManager());
            container.RegisterType<HighlightsViewModel>(new TransientLifetimeManager());
            container.RegisterType<HistoryViewModel>(new TransientLifetimeManager());
            container.RegisterType<LeagueExchangeViewModel>(new TransientLifetimeManager());
            container.RegisterType<LeagueExchangePopupViewModel>(new TransientLifetimeManager());
            container.RegisterType<LearningVideosViewModel>(new TransientLifetimeManager());
            container.RegisterType<LogoutViewModel>(new TransientLifetimeManager());
            container.RegisterType<MainPageMasterViewModel>(new TransientLifetimeManager());
            container.RegisterType<ManagePlaylistViewModel>(new TransientLifetimeManager());
            container.RegisterType<ManageUserViewModel>(new TransientLifetimeManager());
            container.RegisterType<MessengerViewModel>(new TransientLifetimeManager());
            container.RegisterType<NewUserViewModel>(new TransientLifetimeManager());
            container.RegisterType<OpenExchangeViewModel>(new TransientLifetimeManager());
            container.RegisterType<PaymentViewModel>(new TransientLifetimeManager());
            container.RegisterType<PhotosViewModel>(new TransientLifetimeManager());
            container.RegisterType<PlaybookViewModel>(new TransientLifetimeManager());
            container.RegisterType<PlaylistsViewModel>(new TransientLifetimeManager());
            container.RegisterType<PracticeViewModel>(new TransientLifetimeManager());
            container.RegisterType<ProfileViewModel>(new TransientLifetimeManager());
            container.RegisterType<RecyleBinViewModel>(new TransientLifetimeManager());
            container.RegisterType<ReportViewModel>(new TransientLifetimeManager());
            container.RegisterType<ResetPasswordViewModel>(new TransientLifetimeManager());
            container.RegisterType<SecurityViewModel>(new TransientLifetimeManager());
            container.RegisterType<StatisticsViewModel>(new TransientLifetimeManager());
            container.RegisterType<TeamExchangeViewModel>(new TransientLifetimeManager());
            container.RegisterType<TeamExchangePopupViewModel>(new TransientLifetimeManager());
            container.RegisterType<UploadViewModel>(new TransientLifetimeManager());
            container.RegisterType<UsersViewModel>(new TransientLifetimeManager());
            container.RegisterType<ViewFilmViewModel>(new TransientLifetimeManager());
            container.RegisterType<UploadTemplateViewModel>(new TransientLifetimeManager());
            container.RegisterType<ViewLibraryViewModel>(new TransientLifetimeManager());
        }

        private static void RegisterViews(IUnityContainer container)
        {
            container.RegisterType<Login>(new TransientLifetimeManager());
            container.RegisterType<MainPage>(new TransientLifetimeManager());
            container.RegisterType<Dashboard>(new TransientLifetimeManager());
            container.RegisterType<MainPageMaster>(new TransientLifetimeManager());
            container.RegisterType<AddLocker>(new TransientLifetimeManager());
            container.RegisterType<AddLockerPopup>(new TransientLifetimeManager());
            container.RegisterType<Calendar>(new TransientLifetimeManager());
            container.RegisterType<Connect>(new TransientLifetimeManager());
            container.RegisterType<ContactLeagueTeam>(new TransientLifetimeManager());
            container.RegisterType<ContactUs>(new TransientLifetimeManager());
            container.RegisterType<Documentation>(new TransientLifetimeManager());
            container.RegisterType<Documents>(new TransientLifetimeManager());
            container.RegisterType<Exchange>(new TransientLifetimeManager());
            container.RegisterType<ExchangeHistory>(new TransientLifetimeManager());
            container.RegisterType<ExchangeInbox>(new TransientLifetimeManager());
            container.RegisterType<ExchangeInboxPopUp>(new TransientLifetimeManager());
            container.RegisterType<Faq>(new TransientLifetimeManager());
            container.RegisterType<FilmExchange>(new TransientLifetimeManager());
            container.RegisterType<GetLocker>(new TransientLifetimeManager());
            container.RegisterType<GetLockerPopup>(new TransientLifetimeManager());
            container.RegisterType<Highlights>(new TransientLifetimeManager());
            container.RegisterType<History>(new TransientLifetimeManager());
            container.RegisterType<LeagueExchange>(new TransientLifetimeManager());
            container.RegisterType<LeagueExchangePopup>(new TransientLifetimeManager());
            container.RegisterType<LearningVideos>(new TransientLifetimeManager());
            container.RegisterType<LiveStream>(new TransientLifetimeManager());
            container.RegisterType<ManageAppointment>(new TransientLifetimeManager());
            container.RegisterType<ManagePlaylist>(new TransientLifetimeManager());
            container.RegisterType<ManageUser>(new TransientLifetimeManager());
            container.RegisterType<Messenger>(new TransientLifetimeManager());
            container.RegisterType<NewUser>(new TransientLifetimeManager());
            container.RegisterType<OpenExchange>(new TransientLifetimeManager());
            container.RegisterType<OpenExchangePopup>(new TransientLifetimeManager());
            container.RegisterType<Payment>(new TransientLifetimeManager());
            container.RegisterType<Photos>(new TransientLifetimeManager());
            container.RegisterType<Playbook>(new TransientLifetimeManager());
            container.RegisterType<Practice>(new TransientLifetimeManager());
            container.RegisterType<Profiles>(new TransientLifetimeManager());
            container.RegisterType<RecyleBin>(new TransientLifetimeManager());
            container.RegisterType<Report>(new TransientLifetimeManager());
            container.RegisterType<ResetPassword>(new TransientLifetimeManager());
            container.RegisterType<Security>(new TransientLifetimeManager());
            container.RegisterType<ShowPopup>(new TransientLifetimeManager());
            container.RegisterType<Statistics>(new TransientLifetimeManager());
            container.RegisterType<TeamExchange>(new TransientLifetimeManager());
            container.RegisterType<TeamExchangePopup>(new TransientLifetimeManager());
            container.RegisterType<Upload>(new TransientLifetimeManager());
            container.RegisterType<Users>(new TransientLifetimeManager());
            container.RegisterType<ViewFilm>(new TransientLifetimeManager());
            container.RegisterType<UploadTemplate>(new TransientLifetimeManager());
            container.RegisterType<ViewLibrary>(new TransientLifetimeManager());
        }
    }
}
