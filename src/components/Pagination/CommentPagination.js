// components/Pagination/CommentPagination.js

import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

const CommentPagination = ({ totalCount, limit, page, setPage }) => {
    const pageCount = Math.ceil(totalCount / limit);
    const pages = [];

    for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
    }

    return (
        <Pagination size="sm" className="mt-2" style={{ justifyContent: 'center' }}>
            {pages.map((pageNumber) => (
                <Pagination.Item
                    key={pageNumber}
                    active={pageNumber === page}
                    onClick={() => setPage(pageNumber)}
                >
                    {pageNumber}
                </Pagination.Item>
            ))}
        </Pagination>
    );
};

export default CommentPagination;
