import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { Context } from "../index";
import Pagination from 'react-bootstrap/Pagination';
import './Pages.css';

const Pages = observer(() => {
  const { thing } = useContext(Context);
  const pageCount = Math.ceil(thing.totalCount / thing.limit);
  const currentPage = thing.page;

  const getPageNumbers = (currentPage, totalPages) => {
    const maxPagesToShow = 5;
    const pages = [];

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const firstPage = 1;
      const lastPage = totalPages;
      const siblingsCount = 1;

      let startPage = currentPage - siblingsCount;
      let endPage = currentPage + siblingsCount;

      if (startPage <= firstPage + 1) {
        startPage = firstPage + 1;
        endPage = startPage + 2 * siblingsCount;
      }

      if (endPage >= lastPage - 1) {
        endPage = lastPage - 1;
        startPage = endPage - 2 * siblingsCount;
      }

      pages.push(firstPage);

      if (startPage > firstPage + 1) {
        pages.push('ellipsis-prev');
      }

      for (let i = startPage; i <= endPage; i++) {
        if (i > firstPage && i < lastPage) {
          pages.push(i);
        }
      }

      if (endPage < lastPage - 1) {
        pages.push('ellipsis-next');
      }

      pages.push(lastPage);
    }

    return pages;
  };

  const pages = getPageNumbers(currentPage, pageCount);

  // Добавляем useEffect для прокрутки наверх при изменении страницы
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [thing.page]);

  return (
    <Pagination 
      className="mt-5"
      style={{ justifyContent: 'center' }}
    >
      <Pagination.Prev 
        onClick={() => thing.setPage(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {pages.map((page, index) => {
        if (page === 'ellipsis-prev' || page === 'ellipsis-next') {
          return <Pagination.Ellipsis key={index} disabled />;
        } else {
          return (
            <Pagination.Item
              key={page}
              active={currentPage === page}
              onClick={() => thing.setPage(page)}
            >
              {page}
            </Pagination.Item>
          );
        }
      })}
      <Pagination.Next 
        onClick={() => thing.setPage(currentPage + 1)}
        disabled={currentPage === pageCount}
      />
    </Pagination>
  );
});

export default Pages;
