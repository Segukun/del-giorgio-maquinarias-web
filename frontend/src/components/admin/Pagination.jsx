import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ currentPage, pageCount, onPageChange }) => {
  if (pageCount <= 1) return null;

  return (
    <nav className="dg-pagination" aria-label="Paginación de productos">
      <button
        type="button"
        aria-label="Página anterior"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <FiChevronLeft aria-hidden="true" />
      </button>

      {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          type="button"
          className={page === currentPage ? "is-active" : ""}
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        aria-label="Página siguiente"
        disabled={currentPage === pageCount}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <FiChevronRight aria-hidden="true" />
      </button>
    </nav>
  );
};

export default Pagination;
