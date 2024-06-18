import { Button, Nav, NavItem } from "reactstrap";
import Logo from "../../logo/Logo";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from 'react';

import {
  Home, FileText, Activity, Folder, ShoppingCart,
} from 'react-feather';

// import Logo from "../../../assets/images/logos/logo.png";

// import { Home } from "react-icons";

const navigation = [
  {
    id: 'home',
    title: 'Activity',
    icon: <Home size={20} />,
    children: [
      {
        id: 'activity-seller',
        title: 'Seller',
        navLink: '/admin/activity?type=sell',
      },
      {
        id: 'activity-buy',
        title: 'Buy Offer',
        navLink: '/admin/activity?type=buyer offer',
      },
      {
        id: 'activity-watch',
        title: 'WatchList',
        navLink: '/admin/activity?type=watchlist',
      },
      {
        id: 'activity-lease',
        title: 'Lease',
        navLink: '/admin/activity?type=lease',
      },
    ],
  },
  {
    id: 'contacts',
    title: 'Contacts',
    icon: <Activity size={20} />,
    children: [
      {
        id: 'contact-seller',
        title: 'Seller',
        navLink: '/admin/contacts?type=sell',
      },
      {
        id: 'contact-question',
        title: 'Question',
        navLink: '/admin/contacts?type=question',
      },
      {
        id: 'contact-buy-offer',
        title: 'Buy Offer',
        navLink: '/admin/contacts?type=buyer offer',
      },
      {
        id: 'contact-buy-question',
        title: 'Buy Question',
        navLink: '/admin/contacts?type=buyer question',
      },
      {
        id: 'contact-watch',
        title: 'WatchList',
        navLink: '/admin/contacts?type=watchlist',
      },
      {
        id: 'contact-lease',
        title: 'Lease',
        navLink: '/admin/contacts?type=lease',
      },
      {
        id: 'contact-maintenance',
        title: 'maintenance',
        navLink: '/admin/contacts?type=maintenance',
      },
      {
        id: 'contact-inquiry',
        title: 'inquiry',
        navLink: '/admin/contacts?type=inquiry',
      },
    ],
  },
  {
    id: 'products',
    title: 'Products',
    icon: <ShoppingCart size={20} />,
    children: [
      {
        id: 'active-product-shop',
        title: 'Active Product',
        navLink: '/admin/products?type=active',
      },
      {
        id: 'inactive-product-shop',
        title: 'Inactive Product',
        navLink: '/admin/products?type=inactive',
      },
    ],
  },
  {
    id: 'warranty',
    title: 'Warranty',
    icon: <ShoppingCart size={20} />,
    navLink: '/admin/warranty',
  },
  {
    id: 'inventorys',
    title: 'Inventorys',
    icon: <Folder size={20} />,
    children: [
      {
        id: 'active-inventory-shop',
        title: 'Active Inventory',
        navLink: '/admin/inventorys?type=active',
      },
      {
        id: 'inactive-inventory-shop',
        title: 'Inactive Inventory',
        navLink: '/admin/inventorys?type=inactive',
      },
    ],
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: <FileText size={20} />,
    children: [
      {
        id: 'report-contact',
        title: 'Contact',
        navLink: '/admin/reports?type=contact',
      },
      {
        id: 'report-product',
        title: 'Product',
        navLink: '/admin/reports?type=product',
      },
      {
        id: 'report-inventory',
        title: 'Inventory',
        navLink: '/admin/reports?type=inventory',
      },
    ],
  },
];

const Sidebar = ({ showMobilemenu }) => {
  const router = useRouter();
  const location = router.pathname;

  const [collapsedItems, setCollapsedItems] = useState([]);

  const toggleCollapse = (itemId) => {
    if (collapsedItems.includes(itemId)) {
      setCollapsedItems(collapsedItems.filter((id) => id !== itemId));
    } else {
      setCollapsedItems([...collapsedItems, itemId]);
    }
  };

  const renderNavItem = (item, depth = 1) => {
    const hasChildren = item.children && item.children.length > 0;
    const isCollapsed = collapsedItems.includes(item.id);
  
    return (
      <>
        <NavItem key={item.id} className="sidenav-bg">
          {hasChildren || item.icon ? (
            !hasChildren ? (
              <Link href={item.navLink || "#"} passHref={true}>
              <a
                className={
                  location === item.navLink
                    ? "text-primary nav-link py-2 m-0 p-0"
                    : "nav-link text-secondary py-2 m-0 p-0"
                }
              >
                <div 
                  className="sentient-content py-2 m-0 p-0" 
                  style={{ fontSize: '20px'}} 
                >
                  {item.icon} &nbsp;
                  {item.title}
                </div>                
              </a>
            </Link>
            ) : (
            <div 
              className="sentient-content py-2" 
              style={{ fontSize: '20px'}} 
              onClick={() => toggleCollapse(item.id)}
            >
              {item.icon} &nbsp;
              {item.title}
            </div>)
          ) : (
            <Link href={item.navLink || "#"} passHref={true}>
              <a
                className={
                  location === item.navLink
                    ? "text-primary nav-link py-2"
                    : "nav-link text-secondary py-2"
                }
              >
                <i className={item.icon}></i>
                <span className="sentient-content">{item.title}</span>
              </a>
            </Link>
          )}
        </NavItem>
        {hasChildren && isCollapsed && (
          <Nav vertical className={`subNav depth-${depth}`}>
            {item.children.map((child) => renderNavItem(child, depth + 1))}
          </Nav>
        )}
      </>
    );
  };

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Logo /> &nbsp;
         <Button
          close
          size="sm"
          className="ms-auto d-lg-none"
          onClick={showMobilemenu}
        ></Button>
      </div>
      <div className="pt-4 mt-2">
        <Nav vertical className="sidebarNav px-3">
          {navigation.map((item) => renderNavItem(item))}
        </Nav>      
      </div>
    </div>
    
  );
};

export default Sidebar;
