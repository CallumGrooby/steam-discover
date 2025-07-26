import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import { FAQs } from "../components/FAQs/FAQs";
export const Landing = () => {
  return (
    <div className="flex flex-col gap-16">
      <Hero />
      <Features />

      <FAQs />
    </div>
  );
};
