using System;
using Unity;
using Unity.Lifetime;
using wgfapp.Interfaces;
using wgfapp.iOS.Dependencies;

namespace wgfapp.iOS
{
    public class iOSBootstrapper
    {
        public static void Initialize(IUnityContainer container)
        {
            container.RegisterType<IMultiMediaPickerService, MultiMediaPickerService>(new HierarchicalLifetimeManager());
        }
    }
}
