import React, { useState } from "react";
import { TimePlayedToHours } from "../../utils/helper-functions/TimeToHours";
import timeIcon from "../../assets/timeIcon.svg";
import { useParams } from "react-router-dom";
import { Achievements } from "./Achievements";
import placeholderImage from "../../assets/placeholder.svg";
import { BlurImage } from "../BlurImage/BlurImage";

export const GameCard = (props) => {
  const { userId: STEAM_ID } = useParams();
  const { gameInfo, showAchievements = true, image_url = null } = props;

  return (
    <div className="flex flex-col md:flex-row px-2 w-full rounded-sm">
      <BlurImage
        src={!image_url ? gameInfo.banner_url : image_url}
        alt={`${gameInfo.name} banner`}
        placeholderSrc={placeholderImage}
        parentClassName={"md:min-w-[352px] md:min-h-[164px]"}
        className={""}
      />

      <div className="flex flex-col gap-2 bg-[#0082FB] w-full rounded-b-sm md:rounded-b-none md:rounded-r-sm  text-white font-mono px-2 py-2">
        <span className="flex flex-row justify-between ">
          <h1 className="text-lg uppercase font-header font-bold text-start min-h-[2.5rem] flex items-center basis-1/2">
            {gameInfo.name}
          </h1>

          <span className="flex flex-col items-end gap-1 text-base">
            <span className="flex flex-row gap-1 items-center">
              <img src={timeIcon} className="size-6" />
              <p>
                {TimePlayedToHours(
                  gameInfo.playtime ?? gameInfo.playtime_2weeks
                )}
              </p>
            </span>

            {/* Only show 2-week playtime if both values exist and are different */}
            {gameInfo.playtime && gameInfo.playtime_2weeks && (
              <span className="flex flex-row items-center gap-1 grow whitespace-nowrap">
                <img src={timeIcon} alt="" className="size-6 flex-shrink-0" />
                <p className="flex-shrink-0 whitespace-nowrap">
                  {TimePlayedToHours(gameInfo.playtime_2weeks)}
                </p>
              </span>
            )}
          </span>
        </span>

        {showAchievements && <Achievements gameid={gameInfo.appid} />}
      </div>
    </div>
  );
};
