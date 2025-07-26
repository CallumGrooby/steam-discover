import { FetchUserStatsForGame } from "../SteamUltis";

const achievementCompletionCache = new Map();

export const isGameCompleted = async (steamId, appId) => {
  if (achievementCompletionCache.has(appId)) {
    return achievementCompletionCache.get(appId);
  }

  const profileData = await FetchUserStatsForGame(steamId, appId);
  const achievements = profileData?.playerstats?.achievements || [];
  const total = achievements.length;
  const completedCount = achievements.filter((a) => a.achieved === 1).length;
  const completed = completedCount === total && total > 0;

  const result = {
    completed,
    total,
    completedCount,
    achievements,
  };

  achievementCompletionCache.set(appId, result); // ✅ Cache it
  return result;
};
