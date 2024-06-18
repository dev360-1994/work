import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Navbar,
  Collapse,
  Nav,
  NavItem,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";
import { useRouter } from "next/router";
import { handleLogout } from "../../api/auth";

const Header = ({ showMobmenu }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutbtn = () => {
    handleLogout();
    const userData = localStorage.getItem("userData");
    if(!userData){
      router.push('/admin/login');
    }
  }

  return (
    <Navbar className="sentient-header" dark expand="md" style={{ backgroundColor: '#FAF9F6'}}>
      <div className="d-flex align-items-center">
        <Button color="primary" className="d-lg-none" onClick={showMobmenu}>
          <i className="bi bi-list"></i>
        </Button>
      </div>

      <Collapse navbar isOpen={isOpen} className="align-items-center d-flex">
        <Nav className="me-auto" navbar>
          <p className="sentient-contenttitle pt-3">&nbsp;Admin</p>
        </Nav>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle color="gray" >
            <div className="align-itmes-center d-flex" style={{ lineHeight: "0px" }}>
              <p className="sentient-content p-2 " style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#4DAC00'}}>LT</p>
            </div>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => handleLogoutbtn()}>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Collapse>
    </Navbar>
  );
};

export default Header;
