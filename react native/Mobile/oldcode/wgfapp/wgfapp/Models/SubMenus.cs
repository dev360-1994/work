using System;
using wgfapp.Enums;

namespace wgfapp.Models
{
    public class SubMenu
    {
        public string PageName { get; set; }
        public int TypeID { get; set; }
        public Type TargetType { get; set; }
        public string Icon { get; set; }
        public PageKey PageKey { get; set; }

        public SubMenu()
        {
        }

        public SubMenu( string name, int typeID,Type targetPage,string icon, PageKey pageKey = default(PageKey))
        {
            PageName = name;
            TypeID = typeID;
            TargetType = targetPage;
            Icon = icon;
            PageKey = pageKey;
        }
    }
}
