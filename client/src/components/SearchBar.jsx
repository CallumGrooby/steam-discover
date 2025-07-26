import React, { useState } from "react";
import { FetchUserInfo, FetchUserSteamId } from "../utils/SteamUltis";
import { useNavigate } from "react-router-dom";
import search from "../assets/search.svg";
import { Spinner } from "./LoadingSpinner";
import axios from "axios";

const parseSteamInput = (input) => {
  input = input.trim();

  // Match full Steam URL
  const match = input.match(
    /^https?:\/\/steamcommunity\.com\/(id|profiles)\/([^/]+)\/?/i
  );
  if (match) {
    const type = match[1];
    const identifier = match[2];
    return { type, identifier };
  }

  // Match 17-digit SteamID64
  if (/^\d{17}$/.test(input)) {
    return { type: "steamid", identifier: input };
  }

  // Fallback: treat it as vanity ID
  return { type: "vanity", identifier: input };
};

export const SearchBar = () => {
  const [INPUTTED_ID, SET_STEAM_ID] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   setMessage("Loading User Profile ...");
  //   setLoading(true);

  //   const steamID = await FetchUserSteamId(INPUTTED_ID);
  //   console.log(steamID);

  // const userInfo = await FetchUserInfo(STEAM_ID);

  // if (!userInfo || userInfo.players.length <= 0) {
  //   setMessage("Invalid or missing Steam ID.");
  //   setLoading(false);
  //   return;
  // }

  // setLoading(false);
  // setMessage("");
  // const fetchedID = userInfo.players[0].steamid;
  // navigate(`/user/${fetchedID}`);
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("Loading User Profile...");
    setLoading(true);

    const { type, identifier } = parseSteamInput(INPUTTED_ID);

    try {
      const res = await axios.get(`http://localhost:5000/api/get-user-id`, {
        params: { steamuser: identifier },
      });

      const steamID = res.data?.response?.steamid;
      console.log("Resolved Steam ID:", steamID);

      if (!steamID) {
        setMessage("Could not resolve Steam ID.");
        setLoading(false);
        return;
      }

      const userInfo = await FetchUserInfo(steamID);

      if (!userInfo || userInfo.players.length <= 0) {
        setMessage("Invalid or missing Steam ID.");
        setLoading(false);
        return;
      }

      setLoading(false);
      setMessage("");
      const fetchedID = userInfo.players[0].steamid;
      navigate(`/user/${fetchedID}`);

      // continue with your next API calls...
      // const userInfo = await FetchUserInfo(steamID);
      // ...
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setMessage("Failed to fetch user data.");
    }

    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row w-full sm:max-w-2xl gap-2 px-2"
      >
        <input
          type="text"
          value={INPUTTED_ID}
          onChange={(e) => SET_STEAM_ID(e.target.value)}
          placeholder="Enter Your Steam ID"
          className="text-white bg-white/10 border border-white/20 focus:border-white rounded-lg px-4 py-3 w-full placeholder-white placeholder-opacity-70"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-white text-[#0082FB] hover:bg-opacity-90 font-semibold rounded-lg px-4 py-3 h-[50px] transition-colors duration-200"
        >
          {loading ? (
            <Spinner />
          ) : (
            <>
              {/* <span className="hidden sm:inline-block">Search</span> */}
              <img src={search} alt="Search Icon" className="size-5" />
            </>
          )}
        </button>
      </form>

      {message && (
        <p className="text-white mt-2 text-sm text-center px-2">{message}</p>
      )}
    </div>
  );
};
