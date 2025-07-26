import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AchievmentProgress,
  AchivementsCompleted,
} from "../GetGameAchivements";
import {
  FetchAchevements,
  FetchUserStatsForGame,
} from "../../utils/SteamUltis";

import starIcon from "../../assets/starIcon.svg";

export const Achievements = (props) => {
  const { userId: STEAM_ID } = useParams();
  const { gameid: APP_ID } = props;
  const [achivementObject, setAchivements] = useState(null);
  useEffect(() => {
    const GetGameData = async (APP_ID) => {
      const profileData = await FetchUserStatsForGame(STEAM_ID, APP_ID);
      return profileData;
    };

    const GetAchievements = async () => {
      const achievementData = await GetGameData(APP_ID);
      const achievements = achievementData.playerstats.achievements;
      let mergedAchievementInfo = null;
      let progressPercent = null;

      if (achievements) {
        progressPercent = AchievmentProgress(achievements);

        const gameStats = await FetchAchevements(APP_ID);
        if (!gameStats) return;
        const gameAchievements = gameStats.game.availableGameStats.achievements;

        mergedAchievementInfo = gameAchievements.map((obj1) => {
          const match = achievements.find((obj2) => obj2.apiname === obj1.name);
          return {
            ...obj1,
            ...(match && {
              achieved: match.achieved,
              unlocktime: match.unlocktime,
            }),
          };
        });
      }

      setAchivements({ achievements: mergedAchievementInfo, progressPercent });
    };

    GetAchievements();
  }, [STEAM_ID, APP_ID]);

  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!achivementObject) return;

    setCompleted(AchivementsCompleted(achivementObject.achievements || []));

    setTotal(achivementObject.achievements?.length || 0);
    setProgress(achivementObject.progressPercent || 0);
  }, [achivementObject]);

  return (
    <div className="flex flex-col justify-end w-full min-h-8 h-full gap-1 text-sm lg:text-xs xl:text-sm">
      {total > 0 && (
        <div className="flex flex-col lg:flex-row items-center justify-end w-full gap-4">
          <span className="flex flex-row items-center justify-end gap-1 grow whitespace-nowrap">
            <img src={starIcon} alt="" className="size-6 flex-shrink-0" />
            <p className="flex-shrink-0 whitespace-nowrap">
              {`${completed.length} of ${total}`}
            </p>
          </span>

          {/* Progress Bar */}
          <div className="w-full max-w-[328px] h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className="h-2.5 bg-blue-600 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Recently Completed Achievements */}
          <div className="grid grid-cols-5 gap-2">
            {[...completed]
              .sort((a, b) => b.unlocktime - a.unlocktime)
              .slice(0, 5)
              .map((achievement, i) => (
                <div key={i} className="relative group">
                  <img
                    src={achievement.icon}
                    alt=""
                    className="size-8 min-w-8 max-w-10 max-h-10 min-h-8 aspect-square rounded-sm"
                  />

                  {/* Tooltip Content */}
                  <div
                    className="absolute z-10 hidden group-hover:flex flex-col items-center mt-1 px-4 py-2 
             w-fit max-w-[90vw] sm:min-w-[256px] h-fit 
             transform -translate-x-1/2 left-1/2 rounded-sm bg-blue-400"
                  >
                    <h1 className="text-lg font-bold uppercase text-center font-header">
                      {achievement.displayName}
                    </h1>
                    <p className="text-sm font-mono">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
