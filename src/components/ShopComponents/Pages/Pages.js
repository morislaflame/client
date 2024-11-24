import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../../../index";
import { Pagination } from 'antd';
import './Pages.css';

const Pages = observer(() => {
  const { thing } = useContext(Context);
  const totalPages = Math.ceil(thing.totalCount / thing.limit);

  const handlePageChange = (page) => {
    thing.setPage(page);
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Pagination
      current={thing.page}
      total={thing.totalCount}
      pageSize={thing.limit}
      onChange={handlePageChange}
      style={{ margin: 'calc(var(--index) * 3) 0', textAlign: 'center', display: 'flex', justifyContent: 'center' }}
    />
  );
});

export default Pages;
