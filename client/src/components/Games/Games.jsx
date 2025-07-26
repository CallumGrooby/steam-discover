import React, { useEffect, useState } from "react";
import Pagination from "../Pagination";
import { FetchRecentGames } from "../../utils/SteamUltis";
import { GameCard } from "../GameCard/GameCard";
import { LoadingSection } from "../LoadingSection";

export const GamesSection = ({ games, STEAM_ID, onLoaded }) => {
  const [sortMethod, setSortMethod] = useState("allGames");
  const [recentGames, setRecentGames] = useState([]);
  const [allGames, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getSortedGames = () => {
    if (!games) return [];

    switch (sortMethod) {
      case "recentlyPlayed":
        return recentGames;
      case "allGames":
        return allGames;
      // case "completed":
      //   return games;
      default:
        return games;
    }
  };

  const FindRecentGames = async () => {
    if (!games.length) return [];
    const recent = await FetchRecentGames(STEAM_ID);
    if (!recent || !recent.games) return [];

    // Create a map of all games for quick lookup
    const gameMap = new Map(games.map((game) => [game.appid, game]));

    // Merge recent games with matching full game data if possible
    const mergedGames = recent.games.map((recentGame) => {
      const fullGameData = gameMap.get(recentGame.appid);
      return {
        ...fullGameData,
        ...recentGame, // recent data takes precedence
      };
    });

    return mergedGames.sort(
      (a, b) => (b.playtime_2weeks || 0) - (a.playtime_2weeks || 0)
    );
  };

  useEffect(() => {
    const loadGames = async () => {
      setIsLoading(true);
      try {
        const sortedGames = [...games].sort((a, b) => b.playtime - a.playtime);
        setGames(sortedGames);

        const recent = await FindRecentGames();
        setRecentGames(recent);
      } catch (err) {
        console.error("Error loading games section:", err);
      } finally {
        setIsLoading(false);
        onLoaded?.();
      }
    };

    if (games) loadGames();
  }, [games]);

  const sortedGames = getSortedGames();

  return (
    <>
      <div className="xl:container mx-auto flex flex-col sm:flex-row gap-2 px-2 w-full mt-8 mb-2">
        <button
          className={`${
            sortMethod === "recentlyPlayed"
              ? "bg-[#0082FB] text-white"
              : "bg-[#EFEFEF] text-[#0082FB]"
          } hover:text-white px-6 py-4 rounded-sm hover:bg-blue-400 transition-colors duration-300`}
          onClick={() => setSortMethod("recentlyPlayed")}
        >
          Recently Played {`(${recentGames.length})`}
        </button>
        <button
          className={`${
            sortMethod === "allGames"
              ? "bg-[#0082FB] text-white"
              : "bg-[#EFEFEF] text-[#0082FB]"
          } hover:text-white px-6 py-4 rounded-sm hover:bg-blue-400 transition-colors duration-300`}
          onClick={() => setSortMethod("allGames")}
        >
          All Games {`(${games.length})`}
        </button>
        {/* <button
          className={`${
            sortMethod === "completed"
              ? "bg-[#0082FB] text-white"
              : "bg-[#EFEFEF] text-[#0082FB]"
          } hover:text-white px-6 py-4 rounded-sm hover:bg-blue-400 transition-colors duration-300`}
          onClick={() => setSortMethod("completed")}
        >
          Completed Games
        </button> */}
      </div>

      {isLoading ? (
        <LoadingSection loadingMessage={"Loading games..."} />
      ) : (
        sortedGames && (
          <Pagination
            className=""
            variant="grid"
            objectArray={sortedGames}
            objectsPerPage={5}
            renderItem={(data) => <GameCard gameInfo={data} />}
          />
        )
      )}
    </>
  );
};

export default GamesSection;
