import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ page, setPage, totalPages, nextPage, prevPage }) {
  return (
    <div className="flex flex-row items-center">
      <button
        disabled={prevPage === null}
        className={`flex items-center justify-center h-10 w-8 ${
          page === 1 && "cursor-not-allowed"
        }`}
        onClick={() => setPage(page - 1)}
      >
        <span className={`${page === 1 && "text-gray-500"}`}>
          {" "}
          <ChevronLeft size={20} />
        </span>
      </button>
      <div className="flex items-center justify-center h-10 w-20">
        {page} of {totalPages}
      </div>
      <button
        disabled={nextPage === null}
        className={`flex items-center justify-center h-10 w-8 ${
          page === totalPages && "cursor-not-allowed"
        }`}
        onClick={() => setPage(page + 1)}
      >
        <span className={`${page === totalPages && "text-gray-500"}`}>
          {" "}
          <ChevronRight size={20} />
        </span>
      </button>
    </div>
  );
}

export default Pagination;
