// src/pages/Admin/AllUsersPage.js

import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../../index';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Select, Button, Popconfirm, Typography, Space, message, FloatButton } from 'antd';
import TopicBack from '../../../components/FuctionalComponents/TopicBack/TopicBack';
import styles from './AllUsersPage.module.css';
import LoadingIndicator from '../../../components/UI/LoadingIndicator/LoadingIndicator';
import Search from '../../../components/UI/Search/Search';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Text } = Typography;

const AllUsersPage = observer(() => {
  const { admin } = useContext(Context);
  const navigate = useNavigate();
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    admin.loadUsers();
  }, [admin]);

  useEffect(() => {
    setFilteredUsers(admin.users);
  }, [admin.users]);

  const handleSearch = (value) => {
    if (value) {
      const filtered = admin.users.filter(user => 
        user.id.toString().includes(value) ||
        user.email?.toLowerCase().includes(value.toLowerCase()) ||
        user.username?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(admin.users);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await admin.changeUserRole(userId, newRole);
      message.success('User role successfully changed!');
    } catch (error) {
      console.error('Error changing user role:', error);
      message.error('Error changing user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await admin.deleteUser(userId);
      message.success('User successfully deleted!');
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Error deleting user');
    }
  };

  const formatUserOption = (user) => ({
    value: user.id.toString(),
    label: (
      <Space>
        <Text strong>ID:</Text> {user.id}
        <Text strong>Email:</Text> {user.email || `@${user.username}` || `Telegram ID: ${user.telegramId}`}
      </Space>
    )
  });

  const roleOptions = ['USER', 'ADMIN', 'SELLER'];

  return (
    <div className="container">
      <TopicBack title="All Users" />
      <div className={styles.all_users}>
        <Search 
          data={admin.users}
          onSearch={handleSearch}
          placeholder="Enter user ID or email"
          formatOption={formatUserOption}
        />
        {admin.isLoadingUsers ? (
          <LoadingIndicator />
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className={styles.user}>
              <div className={styles.user_info}>
                <span>
                  <strong>User name:</strong> {user.email || `@${user.username}` || `Telegram ID: ${user.telegramId}`}
                </span>
                <span>
                  <strong>ID:</strong> {user.id}
                </span>
              </div>
              <div className={styles.user_actions}>
                <Select
                  defaultValue={user.role}
                  onChange={(value) => handleRoleChange(user.id, value)}
                  style={{ flex: 1 }}
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
                    onClick={() => navigate(`/user/${user.id}`)}
                  >
                    View
                  </Button>
                  <Popconfirm
                    title={`Are you sure you want to delete user ${user.email || `@${user.username}` || `Telegram ID: ${user.telegramId}`}?`}
                    onConfirm={() => handleDeleteUser(user.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="primary" danger icon={<DeleteOutlined />}>
                      Delete
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
