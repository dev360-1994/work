/* eslint-disable @next/next/no-img-element */
// ** React Imports
import { useState } from 'react';
import classnames from 'classnames';
import { X } from 'react-feather';
// ** Configs

import appLogoImage from "../../assets/images/logos/logo_mobile.png";
import { NavItem } from 'reactstrap';
import Link from 'next/link';

const VerticalSideBar = (props) => {
  // ** State
  const { menuVisibility, activeItem, setMenuVisibility } = props;

  const [selSubmenu, setSelSubmenu] = useState(-1);
  // ** Toggles Customizer
  const handleToggle = (e) => {
    e.preventDefault();
    setMenuVisibility(!menuVisibility);
  };
  return (
    <div
      style={{
        minHeight: 'auto', backgroundColor: '#FAF9F6', overflow: 'auto', marginBottom: '20px',
      }}
      className={classnames('customizer', {
        open: menuVisibility,
      })}
    >
      <div className="customizer-content">
        <div
          className="customizer-header px-2 pt-1 pb-0 position-relative h-100 px-md-2"
        >
          <span className="brand-logo">
            <img className="d-sm-flex d-none logo" src={appLogoImage} alt="logo" height="92px" />
            <img className="d-sm-none d-flex logo" src={appLogoImage} alt="logo" height="72px" />
          </span>
          <a href="true" className="customizer-close" onClick={handleToggle}>
            <X />
          </a>
        </div>
        <hr />
        <div className="px-2">
          <ul className="nav navbar-nav">
            <NavItem>
              <Link
                href="/products"
                passHref
                className="align-items-center nav-link"
                onClick={() => window.scrollTo(0, 0)}
              >
                <span className="page-header-title">Buy</span>
              </Link>
            </NavItem>

            {/* sell section */}
            <NavItem>
              <Link
                href="/sell"
                passHref
                className="nav-link"
                onClick={(e) => { e.preventDefault(); }}
              >
                <span className="page-header-title">Sell</span>
              </Link>

              <ul className="nav navbar-nav px-2">
                <NavItem>
                  <Link
                    href="/sell"
                    passHref
                    className="align-items-center"
                    onClick={() => { window.scrollTo(0, 0); }}
                  >
                    <span className="sentient-content sentient-submenutext ">Overview</span>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link
                    href="/sell/listdevice"
                    passHref
                    className="align-items-center"
                    onClick={() => { window.scrollTo(0, 0); }}
                  >
                    <span className="sentient-content sentient-submenutext ">List Your Device</span>
                  </Link>
                </NavItem>
              </ul>
            </NavItem>

            {/* parts */}
            <br />
            <NavItem>
              <a
                className="align-items-center navbar-brand"
                href="http://shopsentientlasers.com/"
                target="_blank"
                rel="noreferrer"
                onClick={() => window.scrollTo(0, 0)}
              >
                <p className="page-header-title"> Parts</p>
              </a>
            </NavItem>

            {/* service section */}
            <NavItem>
              <Link
              passHref
                href="/service"
                className="nav-link"
                onClick={(e) => { e.preventDefault(); }}
              >
                <span className="page-header-title">Services</span>
              </Link>

              <ul className="nav navbar-nav px-2">
                <NavItem>
                  <Link
                    passHref
                    href="/service"
                    className="align-items-center"
                    onClick={() => { window.scrollTo(0, 0); }}
                  >
                    <span className="sentient-content sentient-submenutext ">Overview</span>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link
                    href="/service/repair"
                    passHref
                    className="align-items-center"
                    onClick={() => { window.scrollTo(0, 0); }}
                  >
                    <span className="sentient-content sentient-submenutext ">Repair</span>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link
                    href="/service/financing"
                    passHref
                    className="align-items-center"
                    onClick={() => { window.scrollTo(0, 0); }}
                  >
                    <span className="sentient-content sentient-submenutext ">Financing</span>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link
                    href="/service/clinical-training"
                    passHref
                    className="align-items-center"
                    onClick={() => { window.scrollTo(0, 0); }}
                  >
                    <span className="sentient-content sentient-submenutext ">Clinical Training</span>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link
                    href="/service/practice-development"
                    passHref
                    className="align-items-center"
                    onClick={() => { window.scrollTo(0, 0); }}
                  >
                    <span className="sentient-content sentient-submenutext ">Practice Development</span>
                  </Link>
                </NavItem>
              </ul>
            </NavItem>

            <NavItem>
              <Link
                href="/about"
                passHref
                className="nav-link"
                onClick={(e) => { e.preventDefault(); }}
              >
                <span className="page-header-title">About</span>
              </Link>

              <ul className="nav navbar-nav px-2">
                <NavItem>
                  <Link
                  passHref
                    href="/about"
                    className="align-items-center"
                    onClick={() => { window.scrollTo(0, 0); }}
                  >
                    <span className="sentient-content sentient-submenutext ">Overview</span>
                  </Link>
                </NavItem>
              </ul>
            </NavItem>

            <NavItem>
              <a
                href="https://www.sentientlasers.com/provider-login"
                target="_blank"
                rel="noreferrer"
                className="nav-link"
                onMouseEnter={() => {
                  props.setShowHoverMenu(0);
                }}
                onClick={() => { window.scrollTo(0, 0); }}
              >
                <span className="page-header-title">Provider Portal</span>
              </a>
            </NavItem>

            <NavItem>
              <Link
                passHref
                href="/contact-us"
                className="nav-link"
                onClick={() => window.scrollTo(0, 0)}
              >
                <span className="page-header-title">Contact Us</span>
              </Link>
            </NavItem>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VerticalSideBar;
