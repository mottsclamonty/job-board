import { useMemo } from 'react';
import PaginationContainerWrapper from '../assets/wrappers/PaginationContainerWrapper';
import { useAppContext } from '../context/appContext';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
const PaginationContainer = () => {
  const { page, pageCount, changePage } = useAppContext();

  const prevPage = () => {
    changePage(page - 1);
  };
  const nextPage = () => {
    changePage(page + 1);
  };

  // Array of numbers from 1 -> pageCount
  const pageList = useMemo(() => {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }, [pageCount]);

  return (
    <PaginationContainerWrapper>
      <button className="prev-btn" onClick={prevPage} disabled={page === 1}>
        <HiChevronDoubleLeft />
        prev
      </button>
      <div className="btn-container">
        {pageList.map((pageItem) => (
          <button
            key={pageItem}
            type="button"
            className={`pageBtn ${pageItem === page ? 'active' : ''}`}
            onClick={() => changePage(pageItem)}
          >
            {pageItem}
          </button>
        ))}
      </div>
      <button
        className="next-btn"
        onClick={nextPage}
        disabled={page === pageCount}
      >
        next
        <HiChevronDoubleRight />
      </button>
    </PaginationContainerWrapper>
  );
};

export default PaginationContainer;
