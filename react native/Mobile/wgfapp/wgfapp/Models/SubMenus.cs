using System;
using wgfapp.BootstrapIcons;
using wgfapp.Enums;

namespace wgfapp.Models
{
    public class SubMenu
    {
        public string PageName { get; set; }
        public int TypeID { get; set; }
        public Type TargetType { get; set; }
        public Icon Icon { get; set; }
        public PageKey PageKey { get; set; }

        public SubMenu()
        {
        }

        public SubMenu( string name, int typeID,Type targetPage, Icon icon, PageKey pageKey = default(PageKey))
        {
            PageName = name;
            TypeID = typeID;
            TargetType = targetPage;
            Icon = icon;
            PageKey = pageKey;
        }
    }
}
