import React, { useEffect, useState } from "react";
import { assignGamesWithGenres } from "../../utils/AssignGamesWIthGenres";
import { VerticalGameCard } from "../GameCard/VerticalGameCard";
import { GameCard } from "../GameCard/GameCard";
import placeholderImage from "../../assets/placeholder.svg";
import thumbUpIcon from "../../assets/thumbup.svg";
import thumbDownIcon from "../../assets/thumbdown.svg";
import { BlurImage } from "../BlurImage/BlurImage";
import { LoadingSection } from "../LoadingSection";

export const Recomendation = (props) => {
  const { games: usersGames, onLoaded } = props;

  const [globalGames, setGlobalGames] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [usersGamesWithGenres, setGamesWithGenres] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // 1. Fetch global games
  useEffect(() => {
    const fetchGlobalGames = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/top100in2weeks-with-genres`
        );
        if (!res.ok) throw new Error("Failed to fetch global games");
        const data = await res.json();
        setGlobalGames(data);
      } catch (error) {
        setError("Error fetching global games.");
        console.error(error);
      } finally {
        setLoading(false);
        onLoaded?.();
      }
    };
    fetchGlobalGames();
  }, []);

  // 2. Enrich user games with genres
  useEffect(() => {
    if (!usersGames) return;
    const loadAndEnrichUserGames = async () => {
      try {
        const enrichedUserGames = await assignGamesWithGenres(usersGames);
        setGamesWithGenres(enrichedUserGames);
      } catch (err) {
        setError("Error processing user games.");
        console.error(err);
      }
    };
    loadAndEnrichUserGames();
  }, [usersGames]);

  // 3. Genre vocabulary
  const buildGenreVocabulary = (games, userGames) => {
    const allGenres = new Set();
    [...games, ...userGames].forEach((game) => {
      game.genres?.forEach((g) => allGenres.add(g));
    });
    return Array.from(allGenres);
  };

  // 4. Genre vector
  const genreVector = (game, genreList) => {
    return genreList.map((genre) => (game.genres?.includes(genre) ? 1 : 0));
  };

  // 5. Build user profile vector
  const buildUserProfile = (userGames, genreList) => {
    const weightedVectors = userGames.map((game) => {
      const genreVec = genreVector(game, genreList);
      const avgPlay = game.average_forever || 1;
      const weight = Math.min(game.playtime / avgPlay, 5);
      return genreVec.map((v) => v * weight);
    });

    const sumVector = weightedVectors.reduce(
      (acc, vec) => acc.map((val, i) => val + vec[i]),
      new Array(genreList.length).fill(0)
    );

    const totalWeight = userGames.reduce(
      (sum, game) =>
        sum + Math.min(game.playtime / (game.average_forever || 1), 5),
      0
    );

    return totalWeight > 0
      ? sumVector.map((val) => val / totalWeight)
      : sumVector;
  };

  // 6. Cosine similarity
  const cosineSimilarity = (vecA, vecB) => {
    const dot = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val ** 2, 0));
    const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val ** 2, 0));
    return magA && magB ? dot / (magA * magB) : 0;
  };

  // 7. Compute recommendations
  useEffect(() => {
    if (!globalGames.length || !usersGamesWithGenres.length) return;

    try {
      const genreList = buildGenreVocabulary(globalGames, usersGamesWithGenres);
      const userProfile = buildUserProfile(usersGamesWithGenres, genreList);
      const playedAppIds = new Set(usersGamesWithGenres.map((g) => g.appid));

      const recs = globalGames
        .filter((game) => !playedAppIds.has(game.appid))
        .map((game) => ({
          ...game,
          similarity: cosineSimilarity(
            userProfile,
            genreVector(game, genreList)
          ),
        }))
        .sort((a, b) => b.similarity - a.similarity);

      setRecommendations(recs.slice(0, 10));
    } catch (err) {
      console.error("Error generating recommendations", err);
      setError("Failed to generate recommendations.");
    }
  }, [globalGames, usersGamesWithGenres]);

  useEffect(() => {
    console.log("RECOMMENDATIONS", recommendations);
  }, [recommendations]);

  return (
    <div className="xl:container mx-auto flex flex-col gap-2 px-2">
      <h2 className="text-xl font-semibold mb-4">Your Game Recommendations</h2>
      {loading ? (
        <LoadingSection loadingMessage={"Loading recommendations..."} />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : recommendations.length === 0 ? (
        <LoadingSection loadingMessage={"No recommendations available."} />
      ) : (
        <div className="space-y-2 grid gap-1 sm:grid-cols-2 lg:grid-cols-5 ">
          {recommendations.map((game) => (
            <RecommendationGameCard
              gameInfo={game}
              image_url={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const RecommendationGameCard = (props) => {
  const { gameInfo, image_url } = props;

  return (
    <div className="flex flex-col w-full rounded-sm h-[350px]">
      {" "}
      {/* fixed height */}
      <BlurImage
        src={image_url}
        alt={`${gameInfo.name} banner`}
        placeholderSrc={placeholderImage}
        parentClassName="min-h-[173px]"
        className=""
      />
      <div className="flex flex-col w-full bg-[#0082FB] rounded-b-sm px-2 py-2 text-white font-mono items-center justify-between flex-grow overflow-hidden">
        <h1 className="w-full text-lg flex items-center justify-center font-bold font-header uppercase min-h-[2.5rem] text-center">
          {gameInfo.name}
        </h1>

        <span className="w-full gap-2 flex flex-col">
          <p className="text-center leading-tight min-h-[2em] whitespace-normal overflow-hidden truncate">
            {gameInfo.genres?.join(", ")}
          </p>

          <div className="flex flex-row lg:flex-col lg:justify-end w-full gap-0.5 whitespace-nowrap items-start lg:items-end">
            <span className="flex items-center gap-2">
              <p className="flex-shrink-0 whitespace-nowrap  text-right">
                {gameInfo.positive}
              </p>
              <img src={thumbUpIcon} alt="" className="size-6 flex-shrink-0" />
            </span>

            <span className="flex items-center gap-2">
              <p className="flex-shrink-0 whitespace-nowrap  text-right">
                {gameInfo.negative}
              </p>
              <img
                src={thumbDownIcon}
                alt=""
                className="size-6 flex-shrink-0"
              />
            </span>
          </div>
        </span>
      </div>
    </div>
  );
};
