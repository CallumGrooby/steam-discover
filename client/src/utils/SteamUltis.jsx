import axios from "axios";
import { LATIN1_SWEDISH_CI } from "mysql/lib/protocol/constants/charsets";
import React, { useEffect, useState } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const SteamUltis = () => {
  const STEAM_ID = "76561198079678424";

  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const res = await fetch(
        `${BACKEND_URL}/api/owned-games?steamid=${STEAM_ID}`
      );
      const data = await res.json();
      setGames(data);
    };

    fetchGames();
  }, []);

  const convertMinsToHrsMins = (minutes) => {
    var h = Math.floor(minutes / 60);
    var m = minutes % 60;
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    return h + ":" + m;
  };

  return (
    <div>
      <h2>Owned Games</h2>
      <ul>
        {games.map((game) => (
          <li key={game.appid}>
            {game.name}
            <img src={game.banner_url} />
            <img src={game.icon_url} />
            <p>Playtime: {convertMinsToHrsMins(game.playtime)} hours</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const FetchGames = async (STEAM_ID) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/owned-games?steamid=${STEAM_ID}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching games:", error);
  }
  return null;
};

export const FetchRecentGames = async (STEAM_ID) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/get-recently-played?steamid=${STEAM_ID}`
    );
    const data = await res.json();
    return data.response;
  } catch (error) {
    console.error("Error fetching games:", error);
  }
  return null;
};

export const FetchUserSteamId = async (INPUTTED_ID) => {
  let STEAM_ID = null;

  try {
    const res = await axios.get(`${BACKEND_URL}/api/get-user-id`, {
      params: { steamid: INPUTTED_ID },
    });
    STEAM_ID = res.data;
  } catch (error) {
    console.error("Error fetching profile data:", error);
  }

  if (!STEAM_ID) return null;
  return STEAM_ID.response;
};

export const FetchUserInfo = async (INPUTTED_ID) => {
  let STEAM_PROFILE_INFO = null;

  try {
    const res = await axios.get(`${BACKEND_URL}/api/get-user-info`, {
      params: { steamid: INPUTTED_ID },
    });
    STEAM_PROFILE_INFO = res.data;
  } catch (error) {
    console.error("Error fetching profile data:", error);
  }

  if (!STEAM_PROFILE_INFO) return null;
  return STEAM_PROFILE_INFO.response;
};

export const FetchUserStatsForGame = async (STEAM_ID, APP_ID) => {
  let USER_GAME_DATA = null;
  try {
    const res = await axios.get(`${BACKEND_URL}/api/get-user-stats-for-game`, {
      params: { steamid: STEAM_ID, gameid: APP_ID },
    });

    USER_GAME_DATA = res.data;
  } catch (error) {
    console.error("Error fetching profile data:", error);
  }

  if (!USER_GAME_DATA) return null;
  return USER_GAME_DATA;
};

export const FetchAchevements = async (APP_ID) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/get-acheivement-details`, {
      params: { appid: APP_ID },
    });

    let ACHEVEMENT_DATA = res.data;
    return ACHEVEMENT_DATA;
  } catch (error) {
    console.error("Error fetching profile data:", error);
  }
};
