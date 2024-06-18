import React, { useEffect } from "react";
import { Container } from "reactstrap";
import Header from "./header/Header";
import Sidebar from "./sidebars/vertical/Sidebar";
import jwt_decode from 'jwt-decode';
import { useRouter } from "next/router";

const FullLayout = ({ children }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const showMobilemenu = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const fetchData = async () => {
      const userData = localStorage.getItem('userData');
      if(userData){
        const {token} = JSON.parse(userData);
        const {userId} = jwt_decode(token);
        if(!userId){
          router.push('/admin/login')
        } 
      } else {
        router.push('/admin/login')
      }
    };
    fetchData();
  }, []);

  return (
    <main>
      <div className="pageWrapper d-md-block d-lg-flex">
        {/******** Sidebar **********/}
        <aside
          className={`sidebarArea shadow bg-white ${
            !open ? "" : "showSidebar"
          }`}
        >
          <Sidebar showMobilemenu={() => showMobilemenu()} />
        </aside>
        {/********Content Area**********/}

        <div className="contentArea">
          {/********header**********/}
          <Header showMobmenu={() => showMobilemenu()} />

          {/********Middle Content**********/}
          <Container className="p-4 wrapper" fluid>
            <div>{children}</div>
          </Container>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;
