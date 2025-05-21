import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ page, setPage, totalPages, nextPage, prevPage }) {
  // Force disable previous button on page 1
  const disablePrev = page === 1 || prevPage === null;
  const disableNext = page === totalPages || nextPage === null;
  
  return (
    <div className="flex flex-row items-center">
      <button
        disabled={disablePrev}
        className={`flex items-center justify-center w-8 ${
          disablePrev ? "cursor-not-allowed" : ""
        }`}
        onClick={() => !disablePrev && setPage(page - 1)}
      >
        <span className={disablePrev ? "text-gray-500" : ""}>
          <ChevronLeft size={20} />
        </span>
      </button>
      <div className="flex items-center justify-center w-20">
        {page} of {totalPages}
      </div>
      <button
        disabled={disableNext}
        className={`flex items-center justify-center w-8 ${
          disableNext ? "cursor-not-allowed" : ""
        }`}
        onClick={() => !disableNext && setPage(page + 1)}
      >
        <span className={disableNext ? "text-gray-500" : ""}>
          <ChevronRight size={20} />
        </span>
      </button>
    </div>
  );
}

export default Pagination;
