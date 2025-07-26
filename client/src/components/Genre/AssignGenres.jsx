import React, { useEffect, useState } from "react";
import { GetGenres } from "../../utils/GetGenres";
import { GenreChart } from "./GenreChart";
import CalculateAllGamesPlayTime from "../../utils/helper-functions/CalculateTimePlayed";
import { SectionTitle } from "../SectionTitle";
import { LoadingSection } from "../LoadingSection";

const GamesWithPlaytime = (games) => {
  return [...games].filter((gameInfo) => gameInfo.playtime > 0);
};

const GamesWithTags = async (playedGames) => {
  const results = await Promise.all(
    playedGames.map(async (gameInfo) => {
      const genreInfo = await GetGenres(gameInfo.appid);
      if (!genreInfo) return null;

      const sortedTags = Object.entries(genreInfo.tags)
        .sort((a, b) => b[1] - a[1])
        .map(([tag]) => tag)
        .slice(0, 5);

      return {
        gameInfo,
        genre: sortedTags,
      };
    })
  );

  return results.filter(Boolean); // remove nulls
};

export const AssignGenres = ({ games: allGames, onLoaded }) => {
  const [chartGames, setChartGames] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGenres = async () => {
      setIsLoading(true);
      try {
        const playedGames = GamesWithPlaytime(allGames);
        const gamesWithGenres = await GamesWithTags(playedGames);

        const genreCounts = {};
        gamesWithGenres.forEach(({ genre }) => {
          if (!genre) return;
          genre.forEach((tag) => {
            genreCounts[tag] = (genreCounts[tag] || 0) + 1;
          });
        });

        const filteredGenreCounts = Object.entries(genreCounts)
          .filter(([_, count]) => count >= 5)
          .map(([label, value]) => ({ label, value }));

        setChartGames(gamesWithGenres);
        setChartData(filteredGenreCounts);
      } catch (err) {
        console.error("Error loading genres:", err);
      } finally {
        setIsLoading(false);
        onLoaded?.();
      }
    };

    if (allGames) loadGenres();
  }, [allGames]);

  return (
    <div className="flex flex-col gap-4">
      <SectionTitle
        title={"Most Played Games"}
        subTitle={`Play time: ${CalculateAllGamesPlayTime(allGames)}`}
      />

      {isLoading ? (
        <LoadingSection loadingMessage={"Fetching genres and chart data..."} />
      ) : (
        <GenreChart sourceData={chartData} gamesInChart={chartGames} />
      )}
    </div>
  );
};
