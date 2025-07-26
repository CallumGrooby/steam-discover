import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import arrow from "../../assets/arrow.svg";
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const parentVariants = {
  hover: {}, // Empty unless you want to animate the container
};

const titleVariants = {
  initial: { color: "#1F2937" }, // Tailwind's text-gray-900
  hover: { color: "#0082FB" },
};

export const FAQs = () => {
  const [openId, setOpenId] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How does it work?",
      answer:
        "Our service connects to the Steam API using your Steam ID. It retrieves your gaming statistics, including games owned and playtime. Simply enter your Steam ID to get started.",
    },
    {
      id: 2,
      question: "Why can’t I see my gaming stats after entering my Steam ID",
      answer:
        "Your Steam profile might be set to private. Go to Steam’s privacy settings, set your profile and game details to “Public,” then try searching again.",
    },
    {
      id: 3,
      question: "What kind of stats will I see on my profile?",
      answer:
        "You’ll discover your games owned, total playtime per game, recently played games, and more, all pulled from your public Steam profile.",
    },
    {
      id: 4,
      question: "Is my data safe?",
      answer:
        "Yes, we prioritize your privacy and security. Your data is only used to generate your gaming stats and is not shared with third parties. We adhere to strict data protection standards.",
    },
  ];

  return (
    <section className="flex flex-col items-center md:items-start md:flex-row gap-2 container mx-auto  px-2 w-full mb-8">
      <div className="basis-1/3 flex flex-col items-center md:items-start gap-2">
        <motion.h1
          className="text-xl italic font-bold font-header"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
        >
          FAQs
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
        >
          Find answers to your questions about our gaming stats service and how
          it works.
        </motion.p>

        <motion.button
          className="bg-[#0082FB] text-white rounded-lg px-4 py-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
        >
          Contact Us
        </motion.button>
      </div>

      <motion.section
        className="grow cursor-pointer"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            id={faq.id}
            title={faq.question}
            content={faq.answer}
            openId={openId}
            setOpenId={setOpenId}
            variants={itemVariants}
          />
        ))}
      </motion.section>
    </section>
  );
};

const AccordionItem = ({
  id,
  title,
  content,
  openId,
  setOpenId,
  variants, // Variants for motion animation
}) => {
  const isOpen = id === openId;

  const toggle = () => {
    setOpenId(isOpen ? null : id); // Toggle open/close
  };

  return (
    <motion.div
      className="border border-[#0082FB] rounded mb-2 overflow-hidden"
      variants={variants}
      whileHover="hover"
      initial="initial"
    >
      <button
        className="w-full cursor-pointer text-left p-4 bg-white font-semibold flex flex-row justify-between"
        onClick={toggle}
      >
        <motion.h1 variants={titleVariants} className="font-header font-bold">
          {title}
        </motion.h1>

        <motion.img
          initial={{ rotate: 0 }}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          src={arrow}
          alt=""
        />
      </button>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="p-4 pt-1 font-display text-sm">{content}</div>
      </motion.div>
    </motion.div>
  );
};
