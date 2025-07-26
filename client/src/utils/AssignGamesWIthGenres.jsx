import { GetGenres } from "./GetGenres";

export const filterPlayedGames = (games) =>
  [...games].filter((game) => game.playtime > 0);

// Fetch genres (tags) for a list of played games
export const assignGamesWithGenres = async (games, maxTags = 5) => {
  const playedGames = filterPlayedGames(games);

  const enriched = await Promise.all(
    playedGames.map(async (game) => {
      try {
        const genreInfo = await GetGenres(game.appid);
        if (!genreInfo || !genreInfo.tags) return null;

        const sortedTags = Object.entries(genreInfo.tags)
          .sort((a, b) => b[1] - a[1])
          .map(([tag]) => tag)
          .slice(0, maxTags);

        return {
          ...game,
          genres: sortedTags,
        };
      } catch (error) {
        console.error(`Failed to fetch genres for ${game.appid}:`, error);
        return null;
      }
    })
  );

  return enriched.filter(Boolean);
};
