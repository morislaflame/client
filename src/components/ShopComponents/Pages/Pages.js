import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../../../index";
import { Pagination } from 'antd';

const Pages = observer(() => {
  const { model } = useContext(Context);
  const totalPages = Math.ceil(model.totalCount / model.limit);

  const handlePageChange = (page) => {
    model.setPage(page);
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Pagination
      current={model.page}
      total={model.totalCount}
      pageSize={model.limit}
      onChange={handlePageChange}
      style={{ margin: 'calc(var(--index) * 3) 0', textAlign: 'center', display: 'flex', justifyContent: 'center' }}
    />
  );
});

export default Pages;
