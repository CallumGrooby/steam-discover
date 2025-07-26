export const TimePlayedToHours = (totalPlayTime) => {
  if (!totalPlayTime) return;
  const hours = (totalPlayTime / 60).toFixed(1); // one decimal place
  return `${hours} hours`;
};
