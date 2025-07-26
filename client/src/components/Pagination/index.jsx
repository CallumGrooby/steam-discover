// Pagination.jsx
import { useState } from "react";
import { PaginationButtons } from "./PageinationButtons";
import { motion, AnimatePresence } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -100 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

export const Pagination = ({ objectArray, objectsPerPage = 3, renderItem }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(objectArray.length / objectsPerPage);
  const indexOfLastObject = currentPage * objectsPerPage;
  const indexOfFirstObject = indexOfLastObject - objectsPerPage;
  const currentObjects = objectArray.slice(
    indexOfFirstObject,
    indexOfLastObject
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section className="xl:container mx-auto flex flex-col gap-2">
      <motion.div
        key={currentPage}
        className="min-h-[824px] flex flex-col gap-2"
        variants={container}
        initial="hidden"
        animate="show"
        exit="hidden" // used by AnimatePresence on page changes
      >
        {currentObjects.map((object, i) => (
          <motion.div key={object.id || object.name || i} variants={item}>
            {renderItem(object)}
          </motion.div>
        ))}
      </motion.div>

      <PaginationButtons
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </section>
  );
};

export default Pagination;
