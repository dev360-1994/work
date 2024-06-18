using System;
using System.Collections.Generic;
using System.Text;
using wgfapp.BootstrapIcons;
using wgfapp.Enums;

namespace wgfapp.Models
{
    public class Menu : BaseModel
    {
        public string Name { get; set; }
        public List<SubMenu> SubMenus { get; set; }
        public bool IsVisible { get; set; } = false;

        
        
        public string PageName { get; set; }
        public int TypeID { get; set; }
        public Type TargetType { get; set; }
        public Icon Icon { get; set; }
        public PageKey PageKey { get; set; }


        public Menu()
        {
        }

        public Menu(string name, Icon icon, List<SubMenu> submenus)
        {
            Name = name;
            Icon = icon;
            SubMenus = submenus;
        }

        public Menu(string name, int typeID, Type targetPage, Icon icon, PageKey pageKey = default(PageKey))
        {
            Name = name;
            PageName = name;
            TypeID = typeID;
            TargetType = targetPage;
            Icon = icon;
            PageKey = pageKey;
        }
    }
}
