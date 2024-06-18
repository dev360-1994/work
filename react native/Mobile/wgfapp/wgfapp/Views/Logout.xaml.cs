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
    public partial class Logout : ContentPage
    {
        private readonly LogoutViewModel _logoutViewModel;
        public Logout(LogoutViewModel logoutViewModel)
        {
            InitializeComponent();
            _logoutViewModel = logoutViewModel;
            BindingContext = _logoutViewModel;
        }
    }
}