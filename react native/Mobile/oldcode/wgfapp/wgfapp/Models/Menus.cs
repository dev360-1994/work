using System;
using System.Collections.Generic;
using System.Text;

namespace wgfapp.Models
{
    public class Menu : BaseModel
    {
        public string Name { get; set; }

        public List<SubMenu> SubMenus { get; set; }

        public bool IsVisible { get; set; } = false;

        public Menu()
        {
        }

        public Menu(string  name, List<SubMenu> submenus)
        {
            Name = name;
            SubMenus = submenus;
         }
    }
}
