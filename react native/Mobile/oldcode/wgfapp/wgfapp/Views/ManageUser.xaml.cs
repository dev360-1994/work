using Rg.Plugins.Popup.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using wgfapp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace wgfapp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class ManageUser : ContentPage
    {
        private readonly ManageUserViewModel _manageUserViewModel;
        public ManageUser(ManageUserViewModel manageUserViewModel)
        {
            InitializeComponent();
            _manageUserViewModel = manageUserViewModel;
            BindingContext = _manageUserViewModel;
        }
    }
}