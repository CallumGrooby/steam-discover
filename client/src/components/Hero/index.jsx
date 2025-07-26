import React from "react";
import { SearchBar } from "../SearchBar";
const index = () => {
  return (
    <div className="bg-[#0082FB] w-screen h-[624px] flex flex-col items-center justify-center">
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 text-white">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <h1 className="font-header font-bold text-4xl uppercase text-center">
            Discover Your Steam Story
          </h1>
        </div>

        <p className="text-center font-mono italic">
          Unlock insights into your gaming journey.
        </p>

        <SearchBar />
      </div>
    </div>
  );
};

export default index;
