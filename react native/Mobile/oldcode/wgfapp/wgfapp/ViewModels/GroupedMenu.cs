using System.Collections.ObjectModel;
using System.ComponentModel;
using wgfapp.Models;

namespace wgfapp.ViewModels
{
    public class GroupedMenu : ObservableCollection<SubMenu>, INotifyPropertyChanged
    {
        private ObservableCollection<SubMenu> SubMenusItems = new ObservableCollection<SubMenu>();
       
        public GroupedMenu(Models.Menu menu, bool expanded = false)
        {
            Menus = menu;
            _expanded = expanded;

            foreach (SubMenu submenus in menu.SubMenus)
            {
                SubMenusItems.Add(submenus);
            }

            if (!expanded)
                return;

            AddSubMenuItems();
        }

        public GroupedMenu()
        {
        }

        private bool _expanded;
        public bool Expanded
        {
            get { return _expanded; }
            set
            {
                if (_expanded != value)
                {
                    _expanded = value;
                    OnPropertyChanged(new PropertyChangedEventArgs("Expanded"));
                    OnPropertyChanged(new PropertyChangedEventArgs("StateIcon"));
                    if (_expanded)
                    {
                        AddSubMenuItems();
                    }
                    else
                    {
                        this.Clear();
                    }
                }
            }
        }

        public string StateIcon
        {
            get
            {
                if (Expanded)
                {
                    //return "arrow_a.png";
                    return "";
                }
                else
                { /*return "arrow_b.png";*/
                    return ""; }
            }
        }

        public string Name { get { return Menus.Name; } }

        public Models.Menu Menus { get; set; }

        private void AddSubMenuItems()
        {
            if (!Expanded)
                return;

            foreach (SubMenu subMenu in SubMenusItems)
                this.Add(subMenu);
        }
    }
}