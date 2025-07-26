import React, { useEffect, useState } from "react";
import { useFetcher, useParams } from "react-router-dom";
import { FetchGames, FetchUserInfo } from "../utils/SteamUltis";
import UserInfo from "../components/UserInformation";
import MostPlayedGames from "../components/MostPlayedGames/MostPlayedGames";
import GamesSection from "../components/Games/Games";
import { GenreChart } from "../components/Genre/GenreChart";
import { AssignGenres } from "../components/Genre/AssignGenres";
import { Recomendation } from "../components/Recomendation/Recomendation";

export const UserProfile = () => {
  const { userId } = useParams();

  const [games, setGames] = useState([]);
  const [profile, setProfile] = useState([]);

  const [loadingStates, setLoadingStates] = useState({
    userInfo: true,
    mostPlayed: true,
    gamesSection: true,
    genres: true,
    recommendations: true,
  });

  const loadingLabels = {
    userInfo: "User Info",
    mostPlayed: "Most Played Games",
    gamesSection: "Games Section",
    genres: "Genre Data",
    recommendations: "Recommendations",
  };

  const loadingKeys = Object.entries(loadingStates)
    .filter(([_, value]) => value === true)
    .map(([key]) => loadingLabels[key] || key);

  const loadingMessage = loadingKeys.length
    ? `Loading: ${loadingKeys.join(", ")}...`
    : null;

  useEffect(() => {
    console.log(loadingStates);
  }, [loadingStates]);

  const allLoaded = Object.values(loadingStates).every(
    (status) => status === false
  );

  useEffect(() => {
    const STEAM_ID = userId;

    const loadUserProfileAndGames = async () => {
      try {
        // Fetch User Info
        const userInfo = await FetchUserInfo(STEAM_ID);
        if (!userInfo || userInfo.players.length === 0) {
          console.warn(`No user found with Steam ID: ${STEAM_ID}`);
          return;
        }

        const fetchedID = userInfo.players[0];
        setProfile(fetchedID);

        // Fetch Games
        const gameData = await FetchGames(STEAM_ID);
        if (!gameData) {
          console.warn("No games returned");
          return;
        }

        setGames(gameData);
      } catch (err) {
        console.error("Failed to load user or game data:", err);
      } finally {
        setLoadingStates((prev) => ({ ...prev, userInfo: false }));
      }
    };

    loadUserProfileAndGames();
  }, [userId]);

  return (
    <div>
      {!allLoaded && (
        <div className="fixed top-0 left-0 w-full h-full bg-[#0082FB] z-50 flex flex-col items-center justify-center text-white">
          <div className="loader-bar mb-4"></div>
          <div className="text-lg font-semibold">{loadingMessage}</div>
        </div>
      )}

      {profile && (
        <UserInfo
          profilePic={profile.avatarfull}
          countryCode={profile.loccountrycode}
          username={profile.personaname}
          dateCreated={profile.timecreated}
          onlineStatus={profile.personastate}
          userGames={games}
        />
      )}

      {games ? (
        <>
          <MostPlayedGames
            onLoaded={() =>
              setLoadingStates((prev) => ({ ...prev, mostPlayed: false }))
            }
            games={games}
            STEAM_ID={userId}
          />

          <GamesSection
            onLoaded={() =>
              setLoadingStates((prev) => ({ ...prev, gamesSection: false }))
            }
            games={games}
            STEAM_ID={userId}
          />

          <AssignGenres
            onLoaded={() =>
              setLoadingStates((prev) => ({ ...prev, genres: false }))
            }
            games={games}
          />

          <Recomendation
            onLoaded={() =>
              setLoadingStates((prev) => ({ ...prev, recommendations: false }))
            }
            games={games}
          />
        </>
      ) : (
        <>{`No Games Found :(`}</>
      )}
    </div>
  );
};

export default UserProfile;
