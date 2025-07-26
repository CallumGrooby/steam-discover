const CalculateAllGamesPlayTime = (gamesArray) => {
  if (!gamesArray || gamesArray.length <= 0) return;

  let totalPlayTime = 0;
  gamesArray.forEach((gameData) => {
    totalPlayTime += gameData.playtime || 0;
  });
  const totalHours = Math.round(totalPlayTime / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  const formatted = days > 0 ? `${days}d ${hours}h` : `${hours}h`;

  return formatted;
};

export default CalculateAllGamesPlayTime;
