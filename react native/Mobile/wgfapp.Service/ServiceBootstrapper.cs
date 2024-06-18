using Unity;
using Unity.Lifetime;
using wgfapp.Service.Implementation;
using wgfapp.Service.Interfaces;

namespace wgfapp.Service
{
    public class ServiceBootstrapper
    {
        public static void Initialize(IUnityContainer container)
        {
            container.RegisterType<IAuthenticationService, AuthenticationService>(new TransientLifetimeManager());
            container.RegisterType<IAccountService, AccountService>(new TransientLifetimeManager());
            container.RegisterType<IUploadFilmService, UploadFilmService>(new TransientLifetimeManager());
            container.RegisterType<IPracticePlannerService, PracticePlannerService>(new TransientLifetimeManager());
            container.RegisterType<IUserService, UserService>(new TransientLifetimeManager());
            container.RegisterType<IPlayBookService, PlayBookService>(new TransientLifetimeManager());
            container.RegisterType<IExchangeService, ExchangeService>(new TransientLifetimeManager());
            container.RegisterType<IPlaylistClipsService, PlaylistClipsService>(new TransientLifetimeManager());
            container.RegisterType<IUtilitiesService, UtilitiesService>(new TransientLifetimeManager());
            container.RegisterType<IFileService, FileService>(new TransientLifetimeManager());
            container.RegisterType<ITeamUsersService, TeamUsersService>(new TransientLifetimeManager());
            container.RegisterType<ISchedulerService, SchedulerService>(new TransientLifetimeManager());
            container.RegisterType<IPlaylistService, PlaylistService>(new TransientLifetimeManager());
        }
    }
}
