import React from "react";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  const location = useLocation();
  const isCalendarPage = location.pathname === "/calendar";
  const isSessionsPage = location.pathname === "/office/sessions";
  console.log("rerendered")

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="w-full">
        <Navbar />
      </div>
      <div className="w-full h-full flex">
        <div className="flex-grow overflow-hidden">
          <Sidebar />
        </div>
        <main
          className={`flex-grow w-full h-[90vh] bg-lightBg ${isCalendarPage || isSessionsPage ? "p-0" : "p-8"} overflow-scroll custom-scrollbar`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
