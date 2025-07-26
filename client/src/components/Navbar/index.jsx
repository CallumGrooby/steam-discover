import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { SearchBar } from "../SearchBar";

const index = () => {
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      if (scrolled > 50) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className={`bg-[#0082FB] fixed  top-0 z-50 w-screen transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
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
