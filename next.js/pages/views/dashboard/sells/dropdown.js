import classNames from 'classnames';
import Link from 'next/link';

import { useState } from 'react';

// **  Custom Components

const SellDropDown = (props) => (
  <div
    style={{ backgroundColor: '#FAF9F6', cursor: 'pointer'}}
    className={classNames('main-submenuSelpos pageTop p-0', {
      open: props.showHoverMenu === 1,
    })}
    onMouseLeave={() => {
      props.setShowHoverMenu(0);
    }}
  >
    <div className="row col-12 submenupos m-0 p-0">
      <div className="py-3 px-4 m-0 p-0">
        <Link
          href="/sell"
          passHref
          className="navbar-brand"
          onClick={() => { props.setShowHoverMenu(0); window.scrollTo(0, 0); }}
        >
          <p className="sentient-content sentient-submenutext ">
            Overview
          </p>
        </Link>

        <Link
          // href="/contact-us?s=1"
          href="/sell/listdevice"
          passHref
          className="navbar-brand"
          onClick={() => { props.setShowHoverMenu(0); window.scrollTo(0, 0); }}
        >
          <p className="sentient-content sentient-submenutext" style={{ wordBreak: 'break-word' }}>
            Sell Your Device
            <br />
            For Cash
          </p>
        </Link>

        <Link
          href="/sell/listdevice"
          passHref
          className="navbar-brand"
          onClick={() => { props.setShowHoverMenu(0); window.scrollTo(0, 0); }}
        >
          <p className="sentient-content sentient-submenutext">
            List Your Device on
            <br />
            Our Open Market
          </p>
        </Link>

        <Link
          href="/service/assuredcertification"
          passHref
          className="navbar-brand"
          onClick={() => { props.setShowHoverMenu(0); window.scrollTo(0, 0); }}
        >
          <p className="sentient-content sentient-submenutext">
            Make Your Device
            <br />
            More Valuable
          </p>
        </Link>
      </div>
    </div>
  </div>
);

export default SellDropDown;
