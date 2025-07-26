import React, { useEffect, useState } from "react";
import { FetchUserStatsForGame } from "../../utils/SteamUltis";
import { TimePlayedToHours } from "../../utils/helper-functions/TimeToHours";
import { AchievmentProgress } from "../GetGameAchivements";
import { VerticalGameCard } from "../GameCard/VerticalGameCard";
import CalculateAllGamesPlayTime from "../../utils/helper-functions/CalculateTimePlayed";
import { SectionTitle } from "../SectionTitle";
import { LoadingSection } from "../LoadingSection";

export const MostPlayedGames = ({ games, STEAM_ID, onLoaded }) => {
  const [topFiveGames, setTopGames] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopGamesWithAchievements = async () => {
      if (games && Array.isArray(games)) {
        const sortedGames = [...games].sort((a, b) => b.playtime - a.playtime);
        const slicedArray = sortedGames.slice(0, 5);
        const GetGameData = async (APP_ID) => {
          return await FetchUserStatsForGame(STEAM_ID, APP_ID);
        };

        try {
          const gamesWithAchievements = await Promise.all(
            slicedArray.map(async (game) => {
              const achievementData = await GetGameData(game.appid);
              const achievements = achievementData?.playerstats?.achievements;
              const progressPercent = achievements
                ? AchievmentProgress(achievements)
                : null;

              return {
                ...game,
                achievements,
                progressPercent,
              };
            })
          );
          setTopGames(gamesWithAchievements);
        } catch (err) {
          console.error("Error fetching achievements:", err);
        } finally {
          setIsLoading(false);
          if (onLoaded) onLoaded();
        }
      }
    };

    fetchTopGamesWithAchievements();
  }, [games, STEAM_ID]);

  return (
    <div className="mt-8 flex flex-col gap-4">
      <SectionTitle
        title={"Most Played Games"}
        subTitle={`Play time: ${CalculateAllGamesPlayTime(topFiveGames)}`}
      />

      {isLoading ? (
        <LoadingSection loadingMessage={"Loading your most played games..."} />
      ) : (
        <div className="xl:container mx-auto gap-2 px-2 grid grid-cols-1 sm:grid-cols-2 md:flex lg:flex-row">
          {topFiveGames?.map((game, index) => (
            <VerticalGameCard key={game.id || index} game={game} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MostPlayedGames;
