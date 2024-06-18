using System;
using Unity;
using Unity.Lifetime;
using wgfapp.Interfaces;
using wgfapp.Droid.Dependencies;

namespace wgfapp.Droid
{
    public class DroidBootstrapper
    {
        public static void Initialize(IUnityContainer container)
        {
            container.RegisterType<IMultiMediaPickerService, MultiMediaPickerService>(new HierarchicalLifetimeManager());
        }
    }
}
