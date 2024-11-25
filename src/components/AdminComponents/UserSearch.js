// components/AdminComponents/UserSearch.js

import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../index';
import { useNavigate } from 'react-router-dom';
import { message, AutoComplete, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './AdminComponents.module.css';
import { ALL_SELLERS_ROUTE } from '../../utils/consts';

const UserSearch = () => {
  const { admin } = useContext(Context);
  const [userId, setUserId] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    admin.loadUsers();
  }, [admin]);

  useEffect(() => {
    if (userId) {
      const filtered = admin.users
        .filter(u => u.id.toString().includes(userId))
        .slice(0, 5);
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [userId, admin.users]);

  const handleSearch = async (id) => {
    setIsSearching(true);
    try {
      const result = await admin.getUserById(id);
      if (result) {
        navigate(`/user/${result.id}`);
      }
    } catch (error) {
      console.error('Ошибка при поиске пользователя:', error);
      message.error('Пользователь не найден');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className={styles.search_section}>
      <h3>Найти пользователя по ID</h3>
      <AutoComplete
        style={{ width: '100%' }}
        options={filteredUsers.map(u => ({
          value: u.id.toString(),
          label: `ID: ${u.id} - ${u.email || `@${u.username}` || `Telegram ID: ${u.telegramId}`}`
        }))}
        value={userId}
        onChange={setUserId}
        onSelect={handleSearch}
        placeholder="Введите ID пользователя"
      />
      <button
        onClick={() => navigate('/admin/users')}
        className={styles.all_btn}
        disabled={isSearching}
      >
        {isSearching ? <Spin indicator={<LoadingOutlined style={{ color: 'white' }} spin />} /> : 'Все пользователи'}
      </button>
      <button
        onClick={() => navigate(ALL_SELLERS_ROUTE)}
        className={styles.all_btn}
        disabled={isSearching}
      >
        Все продавцы
      </button>
    </div>
  );
};

export default UserSearch;
