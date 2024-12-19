import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminComponents.module.css';
import { ALL_SELLERS_ROUTE, ALL_USERS_ROUTE } from '../../utils/consts';
import { Button } from 'antd';

const UserSearch = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.search_section}>
      <h3>App Users</h3>
      <div className={styles.user_buttons}>
        <Button
          type="primary"
          onClick={() => {
            if (window.Telegram?.WebApp?.HapticFeedback) {
              window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
            }
            navigate(ALL_USERS_ROUTE)
          }}
        >
          All Users
        </Button>
        <Button
          type="primary"
          onClick={() => {
            if (window.Telegram?.WebApp?.HapticFeedback) {
              window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
            }
            navigate(ALL_SELLERS_ROUTE)
          }}
        >
          All Sellers
        </Button>
      </div>
    </div>
  );
};

export default UserSearch;
