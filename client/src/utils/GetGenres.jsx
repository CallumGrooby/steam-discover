import axios from "axios";

export const GetGenres = async (APP_ID) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const url = `${BACKEND_URL}/api/get-game-genres?gameid=${APP_ID}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching data from SteamSpy:", error);
    return null; // Optional: return a fallback value
  }
};
