import React from "react";
import Top from "./Top";
import Header from "./Header";
import PrimaryNav from "./PrimaryNav";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <div id="main-top" style={{ position: "sticky", top: "0", zIndex: "10" }}>
        <div className="container_12 header">
          <Header />
        </div>
        <PrimaryNav />
      </div>

      <div style={{ marginTop: "20px" }} className="clear-top"></div>

      <Outlet />

      <div className="clear"></div>
      <Footer />
    </>
  );
};

export default MainLayout;
