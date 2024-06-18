import React, { useEffect } from "react";
import { Container } from "reactstrap";
import NavbarPage from "./header/NavbarPage";
import classnames from 'classnames';
import SellDropDown from '../../pages/views/dashboard/sells/dropdown';
import ServiceDropDown from '../../pages/views/dashboard/services/dropdown';
import CustomFooter from "./footer/Footer";
import HSidebar from "./sidebars/horizontal/HSidebar";

const PageLayout = ({ children }) => {

  const [open, setOpen] = React.useState(false);
  const showMobilemenu = () => {
    setOpen(!open);
  };

  const [showHoverMenu, setShowHoverMenu] =  React.useState(0);
  const [menuVisibility, setMenuVisibility] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState(0);

  return (
    <main>
      {/* <div className="pageWrapper d-md-block d-lg-flex"> */}
      <div className="w-100 ">

        {/******** Sidebar **********/}
        <aside
          className={`d-lg-none d-flex sidebarArea shadow bg-white ${!open ? "" : "showSidebar" }`}
        >
          <HSidebar showMobilemenu={() => showMobilemenu()} />
        </aside>
        {/********Content Area**********/}
        <div className="contentArea ">
          {/********header**********/}
          {showHoverMenu > 0 && (
            <div
              style={{ position: 'fixed', top: '-5px', zIndex: '100' }}
              className={classnames('page-mainlayout row col-12 m-0 header-navbar navbar-fixed align-items-center')}
            >
              {showHoverMenu === 1 && <SellDropDown showHoverMenu={showHoverMenu} setShowHoverMenu={setShowHoverMenu} />}
              {showHoverMenu === 2 && <ServiceDropDown showHoverMenu={showHoverMenu} setShowHoverMenu={setShowHoverMenu} />}
            </div>
          )}
          
          <NavbarPage showMobmenu={() => showMobilemenu()} showHoverMenu={showHoverMenu} setShowHoverMenu={setShowHoverMenu} />
          
          {/********Middle Content**********/}
          <Container className="w-100 m-0 p-0" fluid>
            <div>{children}</div>
          </Container>

          <CustomFooter />
        </div>
      </div>
    </main>
  );
};

export default PageLayout;
