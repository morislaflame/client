import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../index";
import Pagination from 'react-bootstrap/Pagination';
import './Pages.css';


const Pages = observer(() => {
    const {thing} = useContext(Context)
    console.log("Total Count:", thing.totalCount); // должно быть 6
    console.log("Limit:", thing.limit); // должно быть 6
    const pageCount = Math.ceil(thing.totalCount / thing.limit)
    const pages = []

    for (let i = 0; i < pageCount; i++) {
        pages.push(i + 1)
    }

    return (
        <Pagination 
            className="mt-5"
            style={{justifyContent: 'center'}}
        >
            {pages.map(page =>
                <Pagination.Item
                    key={page}
                    active={thing.page === page}
                    onClick={() => thing.setPage(page)}
                >
                    {page}
                </Pagination.Item>
            )}
        </Pagination>
    );
});

export default Pages;