const express = require("express");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const cors = require("cors");

dotenv.config();
const API_KEY = process.env.STEAM_API_KEY;
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

console.log(API_KEY);

app.get("/api/owned-games", async (req, res) => {
  const { steamid } = req.query;

  if (!steamid) {
    return res.status(400).json({ error: "Missing steamid" });
  }

  try {
    const response = await fetch(
      `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${steamid}&include_appinfo=true&include_played_free_games=true&format=json
`
    );
    const data = await response.json();
    if (data) {
      const games = data.response.games.map((game) => ({
        name: game.name,
        appid: game.appid,
        icon_url: `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`,
        banner_url: `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`,
        playtime: game.playtime_forever,
      }));

      res.json(games);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/get-user-id", async (req, res) => {
  const { steamuser } = req.query;

  if (!steamuser) {
    return res.status(400).json({ error: "Missing steamuser parameter" });
  }

  // If the input is already a 17-digit SteamID64
  if (/^\d{17}$/.test(steamuser)) {
    return res.json({ response: { steamid: steamuser } });
  }

  try {
    // Assume it's a vanity name and resolve it
    const response = await fetch(
      `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${API_KEY}&vanityurl=${steamuser}`
    );
    const data = await response.json();

    if (data.response.success === 1) {
      return res.json({ response: { steamid: data.response.steamid } });
    } else {
      return res.status(404).json({ error: "Could not resolve vanity URL" });
    }
  } catch (error) {
    console.error("Failed to resolve vanity:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.get("/api/get-user-info", async (req, res) => {
  const { steamid } = req.query;

  if (!steamid) {
    return res.status(400).json({ error: "Missing steamid" });
  }

  try {
    const response = await fetch(
      ` http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${steamid}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/get-user-stats-for-game", async (req, res) => {
  const { steamid, gameid } = req.query;

  if (!steamid) {
    return res.status(400).json({ error: "Missing steamid" });
  }
  if (!gameid) {
    return res.status(400).json({ error: "Missing gameid" });
  }

  try {
    const response = await fetch(
      `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${gameid}&key=${API_KEY}&steamid=${steamid}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/get-game-genres", async (req, res) => {
  const { gameid } = req.query;

  if (!gameid) {
    return res.status(400).json({ error: "Missing gameid" });
  }

  try {
    const response = await fetch(
      `https://steamspy.com/api.php?request=appdetails&appid=${gameid}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/get-recently-played", async (req, res) => {
  const { steamid } = req.query;

  if (!steamid) {
    return res.status(400).json({ error: "Missing steamid" });
  }

  try {
    const response = await fetch(
      `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${API_KEY}&steamid=${steamid}&format=json`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/get-acheivement-details", async (req, res) => {
  const { appid } = req.query;

  if (!appid) {
    return res.status(400).json({ error: "Missing app id" });
  }

  try {
    const response = await fetch(
      `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${API_KEY}&appid=${appid}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch data" });
  }
});

async function batchPromises(items, batchSize, fn) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

app.get("/api/top100in2weeks-with-genres", async (req, res) => {
  try {
    // 1. Fetch top 100 games in last 2 weeks
    const topResponse = await fetch(
      "https://steamspy.com/api.php?request=top100in2weeks"
    );
    if (!topResponse.ok) {
      throw new Error("Failed to fetch top 100 games");
    }
    const topGames = await topResponse.json(); // This returns an object with appid keys

    // Convert to array of games
    const gamesArray = Object.values(topGames);

    // 2. Function to fetch genre for a single game by appid
    async function fetchGenre(game) {
      try {
        const res = await fetch(
          `https://steamspy.com/api.php?request=appdetails&appid=${game.appid}`
        );
        if (!res.ok) {
          console.warn(`Failed to fetch genre for appid ${game.appid}`);
          return { ...game, genres: [] };
        }
        const details = await res.json();
        // genres is usually a string, convert to array for consistency
        const genres = details.genre
          ? details.genre.split(", ").map((g) => g.trim())
          : [];
        return { ...game, genres };
      } catch (err) {
        console.error(`Error fetching genre for appid ${game.appid}`, err);
        return { ...game, genres: [] };
      }
    }

    // 3. Batch fetch genres in groups of 10
    const gamesWithGenres = await batchPromises(gamesArray, 10, fetchGenre);

    res.json(gamesWithGenres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch top games with genres" });
  }
});
