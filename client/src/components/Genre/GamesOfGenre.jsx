import React, { useEffect, useState } from "react";
import { GameCard } from "../GameCard/GameCard";
import { motion, AnimatePresence } from "framer-motion";

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
};

export const GamesOfGenre = ({ gamesInChart, hoveredLabel }) => {
  const [gamesToShow, setShownGames] = useState([]);

  useEffect(() => {
    filterGames(hoveredLabel);
  }, [hoveredLabel]);

  const filterGames = (hoveredLabel) => {
    const filtered = gamesInChart.filter((gameInfo) =>
      gameInfo.genre?.includes(hoveredLabel)
    );

    const numberOfGames = 3;
    const topPlayed = filtered
      .sort((a, b) => b.gameInfo.playtime - a.gameInfo.playtime)
      .slice(0, numberOfGames);
    setShownGames(topPlayed);
  };

  return (
    <motion.div
      layout
      className="flex flex-col gap-2 items-stretch w-full md:min-h-[510px]"
    >
      {gamesToShow.length <= 0 ? (
        <NullPage />
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          {gamesToShow.map((game) => (
            <motion.div
              key={game.gameInfo.appid}
              layout
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={itemVariants.animate.transition}
            >
              <GameCard gameInfo={game.gameInfo} showAchievements={false} />
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

const NullPage = () => {
  return (
    <section className="bg-[#0082FB] w-full flex-1 min-h-[430px] text-center flex items-center justify-center rounded-sm">
      <h1 className="text-white px-4 text-lg">
        Hover over the pie chart to view your most played games of a genre
      </h1>
    </section>
  );
};
