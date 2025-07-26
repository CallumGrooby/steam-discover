import React from "react";
import { Spinner } from "./LoadingSpinner";

export const LoadingSection = ({ loadingMessage }) => {
  return (
    <div className="text-center text-blue-500 py-10 animate-pulse flex flex-col gap-1">
      <h1>{loadingMessage}</h1>
      <div className="flex items-center justify-center gap-2 bg-white text-[#0082FB] hover:bg-opacity-90 font-semibold rounded-lg px-4 py-3 h-[50px] transition-colors duration-200">
        <Spinner color="#0082FB" />
      </div>
    </div>
  );
};
