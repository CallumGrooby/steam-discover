import React from "react";
import { FetchUserStatsForGame } from "../utils/SteamUltis";

export const AchievmentProgress = (achievements) => {
  let totalAchivements = achievements.length;

  let totalCompleted = AchivementsCompleted(achievements);
  let progressPercent = (totalCompleted.length / totalAchivements) * 100;
  return progressPercent;
};

export const AchivementsCompleted = (achievements) => {
  let totalCompleted = [...achievements].filter(
    (achievement) => achievement.achieved == 1
  );
  return totalCompleted;
};

const GetGameData = async (APP_ID, STEAM_ID) => {
  const profileData = await FetchUserStatsForGame(STEAM_ID, APP_ID);
  return profileData;
};

export const GetGameAchivements = async (game, STEAM_ID) => {
  const achievementData = await GetGameData(game.appid, STEAM_ID);
  const achievements = achievementData.playerstats.achievements;
  let progressPercent = null;

  if (achievements) {
    progressPercent = AchievmentProgress(achievements);
  }

  return {
    ...game,
    achievements,
    progressPercent,
  };
};
