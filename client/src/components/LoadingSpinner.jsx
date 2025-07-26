import { motion } from "framer-motion";

export const Spinner = ({ color = "#000000" }) => {
  return (
    <motion.div
      className="size-5 border-2 border-t-transparent rounded-full"
      style={{
        borderColor: `${color} ${color} ${color} transparent`, // sets top border transparent
      }}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      }}
    />
  );
};
