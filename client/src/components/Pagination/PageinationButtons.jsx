export const PaginationButtons = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const visiblePages = 5;
  const pages = [];

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  let start = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
  let end = start + visiblePages - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(end - visiblePages + 1, 1);
  }

  // Prev button
  pages.push(
    <button
      className="pagination-button-next"
      key="prev"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      Prev
    </button>
  );

  // Desktop full pagination
  if (!isMobile) {
    if (start > 1) {
      pages.push(
        <button
          className="pagination-button"
          key={1}
          onClick={() => onPageChange(1)}
        >
          1
        </button>
      );
      if (start > 2) {
        pages.push(
          <span className="pagination-ellipsis" key="start-ellipsis">
            ...
          </span>
        );
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`${currentPage === i ? "selected" : ""} pagination-button`}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(
          <span className="pagination-ellipsis" key="end-ellipsis">
            ...
          </span>
        );
      }
      pages.push(
        <button
          className="pagination-button"
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }
  } else {
    // Mobile: show just current page
    pages.push(
      <span key="mobile-current" className="pagination-button font-bold">
        {currentPage}
      </span>
    );
  }

  // Next button
  pages.push(
    <button
      className="pagination-button-next"
      key="next"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  );

  return (
    <div className="flex flex-wrap justify-center sm:justify-end gap-2 py-4">
      {pages}
    </div>
  );
};
