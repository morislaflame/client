// src/pages/Admin/AllUsersPage.js

import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../../index';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import {
  AutoComplete,
  message,
  Spin,
  FloatButton,
  Select,
  Button,
  Popconfirm,
  Typography,
  Space,
} from 'antd';
import {
  LoadingOutlined,
  SearchOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import TopicBack from '../../../components/FuctionalComponents/TopicBack/TopicBack';
import styles from './AllUsersPage.module.css';

const { Option } = Select;
const { Title, Text } = Typography;

const AllUsersPage = observer(() => {
  const { admin } = useContext(Context);
  const [userId, setUserId] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

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
    if (!id) {
      message.warning('Пожалуйста, введите ID пользователя для поиска.');
      return;
    }
    setIsSearching(true);
    try {
      const result = await admin.getUserById(id);
      if (result) {
        navigate(`/user/${result.id}`);
      } else {
        message.error('Пользователь не найден');
      }
    } catch (error) {
      console.error('Ошибка при поиске пользователя:', error);
      message.error('Пользователь не найден');
    } finally {
      setIsSearching(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await admin.changeUserRole(userId, newRole);
      message.success('Роль пользователя успешно изменена!');
    } catch (error) {
      console.error('Ошибка при изменении роли пользователя:', error);
      message.error('Ошибка при изменении роли пользователя');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await admin.deleteUser(userId);
      message.success('Пользователь успешно удален!');
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      message.error('Ошибка при удалении пользователя');
    }
  };

  const autoCompleteOptions = filteredUsers.map(u => ({
    value: u.id.toString(),
    label: (
      <Space>
        <Text strong>ID:</Text> {u.id}
        <Text strong>Email:</Text> {u.email || `@${u.username}` || `Telegram ID: ${u.telegramId}`}
      </Space>
    ),
  }));

  const roleOptions = ['USER', 'ADMIN', 'SELLER'];

  return (
    <div className="container">
        <TopicBack title="Все пользователи" />

      
      
      <div className={styles.all_users}>
        <div className={styles.search_section}>
          <AutoComplete
            style={{ width: '100%'}}
            options={autoCompleteOptions}
            value={userId}
            onChange={setUserId}
            onSelect={handleSearch}
            placeholder="Введите ID пользователя"
            notFoundContent={isSearching ? <Spin indicator={<LoadingOutlined spin />} /> : null}
            filterOption={(inputValue, option) =>
              option.value.toLowerCase().includes(inputValue.toLowerCase())
            }
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => handleSearch(userId)}
            loading={isSearching}
            block
          >
            Найти пользователя
          </Button>
        </div>
        {admin.isLoadingUsers ? (
          <Spin tip="Загрузка пользователей..." />
        ) : (
          admin.users.map((u) => (
            <div key={u.id} className={styles.user}>
              <div className={styles.user_info}>
                <span>
                  <strong>Имя пользователя:</strong> {u.email || `@${u.username}` || `Telegram ID: ${u.telegramId}`}
                </span>
                <span>
                  <strong>ID:</strong> {u.id}
                </span>
              </div>
              <div className={styles.user_actions}>
                <Select
                  defaultValue={u.role}
                  onChange={(value) => handleRoleChange(u.id, value)}
                  style={{ flex: 1}}
                >
                  {roleOptions.map(role => (
                    <Option key={role} value={role}>
                      {role}
                    </Option>
                  ))}
                </Select>
                <div className={styles.user_actions_buttons}>
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/user/${u.id}`)}
                  >
                    Посмотреть
                  </Button>
                  <Popconfirm
                    title={`Вы уверены, что хотите удалить пользователя ${u.email || `@${u.username}` || `Telegram ID: ${u.telegramId}`}?`}
                    onConfirm={() => handleDeleteUser(u.id)}
                    okText="Да"
                    cancelText="Нет"
                  >
                    <Button type="primary" danger icon={<DeleteOutlined />}>
                      Удалить
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <FloatButton.BackTop type='primary' />
    </div>
  );
});

export default AllUsersPage;
