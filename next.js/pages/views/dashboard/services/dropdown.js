import classNames from 'classnames';
import Link from 'next/link';

// **  Custom Components

const ServiceDropDown = (props) => (
  <div
  style={{ backgroundColor: '#FAF9F6', cursor: 'pointer'}}
    className={classNames('main-submenuServicepos pageTop p-0', {
      open: props.showHoverMenu === 2,
    })}
    onMouseLeave={() => {
      props.setShowHoverMenu(0);
    }}
  >
    <div className="row col-12 submenupos m-0 p-0">
      <div className="pt-3 px-4 pb-1 m-0 p-0">
        <Link
          href="/service"
          passHref
          className="navbar-brand"
          onClick={() => { props.setShowHoverMenu(0); window.scrollTo(0, 0); }}
        >
          <p className="sentient-content sentient-submenutext">
            Overview
          </p>
        </Link>
       
        <Link
          href="/service/repair"
          passHref
          className="navbar-brand"
          onClick={() => { props.setShowHoverMenu(0); window.scrollTo(0, 0); }}
        >
          <p className="sentient-content sentient-submenutext ">
            Repair
          </p>
        </Link>
        
        <Link
          href="/service/financing"
          passHref
          className="navbar-brand"
          onClick={() => { props.setShowHoverMenu(0); window.scrollTo(0, 0); }}
        >
          <p className="sentient-content sentient-submenutext">
            Financing
          </p>
        </Link>
        
        <Link
          href="/service/clinical-training"
          passHref
          className="navbar-brand"
          onClick={() => { props.setShowHoverMenu(0); window.scrollTo(0, 0); }}
        >
          <p className="sentient-content sentient-submenutext">
            Clinical Training
          </p>
        </Link>
        
        <Link
          href="/service/practice-development"
          passHref
          className="navbar-brand"
          onClick={() => { props.setShowHoverMenu(0); window.scrollTo(0, 0); }}
        >
          <p className="sentient-content sentient-submenutext">
            Practice Development
          </p>
        </Link>

        <Link
          href="/service/repair#protectionPlans"
          passHref
          className="navbar-brand"
          onClick={() => { props.setShowHoverMenu(0); window.scrollTo(0, 0); }}
        >
          <p className="sentient-content sentient-submenutext">
            Warranty
          </p>
        </Link>

        <Link
          href="/about#devicecertification"
          passHref
          className="navbar-brand"
          onClick={() => { props.setShowHoverMenu(0); window.scrollTo(0, 0); }}
        >
          <p className="sentient-content sentient-submenutext">
            Device Certification
          </p>
        </Link>
      </div>
    </div>
  </div>

);

export default ServiceDropDown;
