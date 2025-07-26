import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { SearchBar } from "../SearchBar";

const index = () => {
  return (
    <>
      <div className="bg-[#0082FB] sticky top-0 z-50">
        <nav className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between py-4 text-white">
            <NavLink
              to={"/"}
              className="text-xl font-header font-bold uppercase mb-2 sm:mb-0"
            >
              Steam Discover
            </NavLink>
            <div className="w-full sm:w-auto">
              <SearchBar />
            </div>
          </div>
        </nav>
      </div>

      <Outlet />
    </>
  );
};

export default index;
