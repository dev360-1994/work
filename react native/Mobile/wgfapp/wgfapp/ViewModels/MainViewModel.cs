using System;
namespace wgfapp.ViewModels
{
    public class MainViewModel : BaseViewModel
    {
        private MenusGroupViewModel _menusGroupViewModel;

        public MenusGroupViewModel MenusGroupViewModel
        {
            get { return _menusGroupViewModel; }
            set { SetProperty(ref _menusGroupViewModel, value); }
        }

        public MainViewModel(MenusGroupViewModel menusGroupViewModel)
        {
            MenusGroupViewModel = menusGroupViewModel;
        }

        public void OnViewAppear()
        {
            MenusGroupViewModel.OnViewAppear();
        }

        public void OnViewDisappear()
        {

        }
    }
}
