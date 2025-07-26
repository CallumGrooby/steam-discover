import React, { useState } from "react";
import CalculateAllGamesPlayTime from "../../utils/helper-functions/CalculateTimePlayed";
import { useParams } from "react-router-dom";
import { BlurImage } from "../BlurImage/BlurImage";
import placeholderImage from "../../assets/placeholder.svg";
const UserInfo = (props) => {
  const { userId } = useParams();
  const {
    profilePic,
    countryCode,
    username,
    dateCreated,
    onlineStatus,
    userGames,
  } = props;

  const formatDate = () => {
    const date = new Date(dateCreated * 1000); // convert to milliseconds
    const yy = String(date.getFullYear()).slice(2); // get last 2 digits
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const formatted = `${yy}Y ${mm}M`;
    return formatted;
  };

  function formatOnlineStatus(onlineStatus) {
    const dotColorMap = {
      0: "bg-gray-500",
      1: "bg-green-500",
      2: "bg-red-500",
      3: "bg-yellow-500",
      4: "bg-purple-500",
      5: "bg-blue-500",
      6: "bg-teal-500",
    };

    const statusLabelMap = {
      0: "Offline",
      1: "Online",
      2: "Busy",
      3: "Away",
      4: "Snooze",
      5: "Looking to Trade",
      6: "Looking to Play",
    };

    const dotColor = dotColorMap[onlineStatus] || "bg-gray-800";
    const label = statusLabelMap[onlineStatus] || "Unknown Status";

    return (
      <span className="inline-flex items-center gap-2 font-mono">
        <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></span>
        {label}
      </span>
    );
  }

  return (
    <div className="w-screen bg-[#0082FB] flex flex-col items-center justify-center">
      <div className="container min-h-[224px] px-4 pb-4 flex flex-col md:flex-row items-center justify-center md:justify-between lg:px-28 gap-2">
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <BlurImage
            src={profilePic}
            alt={`The Profile picture for ${username}`}
            placeholderSrc={placeholderImage}
            parentClassName="size-24 rounded-full"
          />

          <div className="text-white flex flex-col gap-0.5">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <h1 className="text-2xl uppercase font-header font-bold">
                {username}
              </h1>
              <h2 className="text-sm uppercase italic text-blue-200 font-mono">
                {userId}
              </h2>
            </div>

            <div className="flex flex-row gap-4 items-center">
              {countryCode && (
                <div className="flex items-center gap-2">
                  <img
                    className="h-6"
                    src={`https://flagsapi.com/${countryCode.toUpperCase()}/flat/64.png`}
                    alt={`${countryCode} flag`}
                  />
                  <p className="font-mono">{countryCode}</p>
                </div>
              )}
              <p className="font-mono">{formatDate()}</p>
              {formatOnlineStatus(onlineStatus)}
            </div>
          </div>
        </div>

        {/* User Games Section */}
        {userGames && (
          <div className="text-white font-mono flex flex-col gap-2">
            <p>Total Play Time: {CalculateAllGamesPlayTime(userGames)}</p>
            <p>Games Played: {userGames.length}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
