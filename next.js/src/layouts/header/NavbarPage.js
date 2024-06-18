import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Navbar,
  Collapse,
  Nav,
  NavItem,
  NavbarBrand,
  Dropdown,
  Button,
} from "reactstrap";

import LogoImage from "../../assets/images/logos/logo.png";
import LogomobileImage from "../../assets/images/logos/logo_mobile.png";

const NavbarPage = ( props ) => {
  
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <Navbar 
      className=" px-md-5 px-2 m-0 p-0"
      expand="lg"
      style={{ boxShadow: '0px 4px 16px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.12)', position: 'fixed', top: '0px', height: '132px', width: '100%', zIndex: '100', backgroundColor: '#FFF'}}
    >
      <div className="d-sm-flex d-none align-items-start align-items-center">
        <Link href="/" passHref={true}>
          <a className="navbar-brand">
            <Image className="d-sm-flex d-none" src={LogoImage} alt="logo" />
          </a>
        </Link>
      </div>
      <div className="d-sm-none d-flex align-items-start align-items-center">
        <Link href="/" passHref={true}>
          <a className="navbar-brand">
            <Image className="d-sm-none d-flex justify-content-start " src={LogomobileImage} alt="logo" />
          </a>
        </Link>
      </div>

      <div className="d-lg-none d-flex">
        <Button color="primary" className="d-lg-none" onClick={props.showMobmenu} style={{ borderRadius: '55%'}}>
          <i className="bi bi-list"></i>
        </Button>
      </div>
      
      <Collapse className="align-items-center justify-content-end d-lg-flex d-none"  navbar isOpen={isOpen}>
        <Nav className="me-auto px-md-3" style={{ position: 'absolute', left: '270px'}}>
          <NavItem>
            <Link href="/products" passHref={true}>
              <a 
                className="nav-link"              
                onMouseEnter={() => {
                  props.setShowHoverMenu(0);
                }}
              >
                <span className="page-header-title sentient-nav">Buy</span>
              </a>
            </Link>
          </NavItem>
          <NavItem>
            <Link href="/sell" passHref={true}>
              <a 
                className="nav-link"              
                onMouseEnter={() => {
                  props.setShowHoverMenu(1);
                }}
              >
                <span className="page-header-title sentient-nav" style={{ color : props.showHoverMenu === 1 ? '#4DAC00' : '' }}>Sell</span>
              </a>
            </Link>
          </NavItem>
          <NavItem>
            <Link href="http://shopsentientlasers.com/" passHref={true}>
              <a 
                className="nav-link" 
                target="_blank" 
                rel="noreferrer" 
                onMouseEnter={() => {
                  props.setShowHoverMenu(0);
                }}
              >
                <span className="page-header-title sentient-nav">Parts</span>
              </a>
            </Link>
          </NavItem>
          <NavItem>
            <Link href="/service" passHref={true}>
              <a 
                className="nav-link"
                onMouseEnter={() => {
                  props.setShowHoverMenu(2);
                }}
              >
                <span className="page-header-title sentient-nav" style={{ color : props.showHoverMenu === 2 ? '#4DAC00' : '' }}>Services</span>
              </a>
            </Link>
          </NavItem>
          <NavItem>
            <Link href="/about" passHref={true}>
              <a 
                className="nav-link"              
                onMouseEnter={() => {
                  props.setShowHoverMenu(0);
                }}
              >
                <span className="page-header-title sentient-nav">About</span>
              </a>
            </Link>
          </NavItem>
          <NavItem>
            <Link href="https://www.sentientlasers.com/provider-login" passHref={true}>
              <a 
                className="nav-link" 
                target="_blank" 
                rel="noreferrer"
                onMouseEnter={() => {
                  props.setShowHoverMenu(0);
                }}
              >
                <span className="page-header-title sentient-nav">Provider Portal</span>
              </a>
            </Link>
          </NavItem>
        </Nav>
        <Dropdown isOpen={dropdownOpen} toggle={toggle} >
          <Link href="/contact-us" style={{ zIndex: '2000' }} passHref={true}>
            <a 
              className="nav-link main-navbar-button"
              onMouseEnter={() => {
                props.setShowHoverMenu(0);
              }}
            >
              <span className="page-header-button">Contact us</span>
            </a>
          </Link>
        </Dropdown>
      </Collapse>      
    </Navbar>
  );
};

export default NavbarPage;
