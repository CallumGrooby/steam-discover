import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import gettingSteamID from "../../assets/STEAM_ID.gif";
import placeholderIcon from "../../assets/placeholder.svg";
import { CopyIcon, LogInIcon, SearchIcon, UserIcon } from "../StepIcons";
const ID_STEPS = [
  {
    icon: <LogInIcon size={24} color="#0082FB" />,
    heading: "Log in to Steam",
    text: "Visit steampowered.com and sign in to your account.",
  },
  {
    icon: <UserIcon size={24} color="#0082FB" />,
    heading: "Click Your Account",
    text: "In the top-right corner, click your username to view your account details.",
  },
  {
    icon: <CopyIcon size={24} color="#0082FB" />,
    heading: "Copy Your Steam ID",
    text: "Check the URL in your browser for a 17-digit number (e.g., 76561199848860650). Copy that number.",
  },
  {
    icon: <SearchIcon size={24} color="#0082FB" />,
    heading: "Paste and Search",
    text: "Return to the search bar above, paste your Steam ID, and hit search to explore your gaming stats!",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.5, // delay between children
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const index = () => {
  return (
    <div className="flex flex-col gap-8">
      <motion.div
        className="container mx-auto flex flex-col md:flex-row gap-4 items-center px-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{
          opacity: { duration: 1.6, ease: "easeOut" },
        }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <span className="flex flex-col gap-2 basis-2/5">
          <h1 className="text-2xl font-header font-bold italic">
            Finding Your Steam ID
          </h1>
          <p className="text-base text-gray-500 italic">
            Your Steam ID is a unique identifier for your Steam profile, letting
            us pull your gaming stats like games owned and playtime.
          </p>
        </span>

        <div className="grow">
          <img
            src={gettingSteamID}
            alt="A Video of how to find your steam id"
            className=""
          />
        </div>
      </motion.div>

      <motion.div
        className="md:container px-2 sm:px-8 md:px-2 mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        {ID_STEPS.map((step, i) => {
          return (
            <motion.div
              key={i}
              whileHover={{
                backgroundColor: "#0082FB",
                color: "#fff",
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.9 }}
              className="border border-[#0082FB] rounded mb-2 overflow-hidden basis-1/4 p-2 flex flex-col gap-3"
              variants={childVariants}
            >
              {step.icon}
              <h2 className="text-lg font-header font-bold italic">
                {step.heading}
              </h2>
              <p className="text-base font-display italic">{step.text}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default index;
