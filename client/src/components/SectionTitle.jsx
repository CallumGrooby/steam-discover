import React from "react";

export const SectionTitle = (props) => {
  const { title, subTitle } = props;

  return (
    <div className="xl:container mx-auto flex flex-col gap-1 px-2 w-full">
      <h1 className="uppercase font-header text-lg">{title}</h1>
      <p className="font-mono uppercase text-sm">{subTitle}</p>
      <span className="w-full border-b-2 border-[#0082FB]"></span>
    </div>
  );
};
