import { Button, Nav, NavItem } from "reactstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState } from 'react';

import {
  Home, FileText, Activity, Folder, ShoppingCart,
} from 'react-feather';

const navigation = [
  {
    id: 'buy',
    title: 'Buy',
    icon: <ShoppingCart size={20} />,
    navLink: '/products',    
  },
  {
    id: 'sell',
    title: 'Sell',
    icon: <ShoppingCart size={20} />,
    children: [
      {
        id: 'overviewer',
        title: <p className="sentient-content sentient-submenutext">
                  Overview
                </p>,
        navLink: '/sell',
      },
      {
        id: 'Sell-Your-Device',
        title: <p className="sentient-content sentient-submenutext" style={{ wordBreak: 'break-word' }}>
                Sell Your Device
                <br />
                For Cash
              </p>,
        navLink: '/sell/listdevice',
      },
      {
        id: 'List-Your-Device',
        title: <p className="sentient-content sentient-submenutext">
                List Your Device on
                <br />
                Our Open Market
              </p>,
        navLink: '/sell/listdevice',
      },
      {
        id: 'assuredcertification',
        title: <p className="sentient-content sentient-submenutext">
                  Make Your Device
                  <br />
                  More Valuable
                </p>,
        navLink: '/service/assuredcertification',
      },
    ],
  },
  {
    id: 'parts',
    title: 'Parts',
    icon: <ShoppingCart size={20} />,
    navLink: 'http://shopsentientlasers.com/',
  },
  {
    id: 'services',
    title: 'Services',
    icon: <FileText size={20} />,
    children: [
      {
        id: 'serviceoverview',
        title: <p className="sentient-content sentient-submenutext">
                Overview
              </p>,
        navLink: '/service',
      },
      {
        id: 'serviceRepair',
        title: <p className="sentient-content sentient-submenutext ">
                  Repair
                </p>,
        navLink: '/service/repair',
      },
      {
        id: 'servicefinancing',
        title: <p className="sentient-content sentient-submenutext">
                Financing
              </p>,
        navLink: '/service/financing',
      },
      {
        id: 'serviceclinical',
        title: <p className="sentient-content sentient-submenutext">
                Clinical Training
              </p>,
        navLink: '/service/clinical-training',
      },
      {
        id: 'servicepractice',
        title: <p className="sentient-content sentient-submenutext">
                Practice Development
              </p>,
        navLink: '/service/practice-development',
      },
      {
        id: 'servicewarranty',
        title: <p className="sentient-content sentient-submenutext">
                Warranty
              </p>,
        navLink: '/service/repair#protectionPlans',
      },
      {
        id: 'servicedevice',
        title: <p className="sentient-content sentient-submenutext">
                Device Certification
              </p>,
        navLink: '/about#devicecertification',
      },
    ],
  },
  {
    id: 'about',
    title: 'About',
    icon: <FileText size={20} />,
    navLink: '/about',
  },
  {
    id: 'providerportal',
    title: 'Provider Portal',
    icon: <FileText size={20} />,
    navLink: 'https://www.sentientlasers.com/provider-login',
  },
  {
    id: 'contact',
    title: 'Contact us',
    icon: <FileText size={20} />,
    navLink: '/contact-us',
  },
];

const HSidebar = ({ showMobilemenu }) => {
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
      <Fragment key={item.id}>
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
                  className="sentient-content py-1 m-0 p-0" 
                  style={{ fontSize: '20px'}} 
                >
                  {item.icon} &nbsp;
                  {item.title}
                </div>                
              </a>
            </Link>
            ) : (
            <div 
              className="sentient-content py-1" 
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
                    ? "text-primary nav-link py-1"
                    : "nav-link text-secondary py-1"
                }
                key = {`${item.id}-${item.title}`}
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
        </Fragment>
      </>
    );
  };

  return (
    <div className="pt-3">
      <div className="d-flex justify-content-end">
         <Button
          close
          className="ms-auto d-lg-none"
          onClick={showMobilemenu}
        ></Button>
      </div>
      <div className="pb-5 h-100 p-3">
          {navigation.length > 0 && ( // Check if navigation array has items
            <Nav vertical className="sidebarNav px-2">
              {navigation.map((item) => renderNavItem(item))}
            </Nav>
          )}    
      </div>
    </div>    
  );
};

export default HSidebar;
