// src/pages/Admin/AllUsersPage.js

import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../../index';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Typography, Space, FloatButton } from 'antd';
import TopicBack from '../../../components/FuctionalComponents/TopicBack/TopicBack';
import styles from './AllUsersPage.module.css';
import LoadingIndicator from '../../../components/UI/LoadingIndicator/LoadingIndicator';
import Search from '../../../components/UI/Search/Search';
import { EyeOutlined } from '@ant-design/icons';

const { Text } = Typography;

const AllUsersPage = observer(() => {
    const { admin } = useContext(Context);
    const navigate = useNavigate();
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        admin.loadUsers();
    }, [admin]);

    const formatUserOption = (user) => ({
        value: user.id.toString(),
        label: (
            <Space>
                <Text strong>ID:</Text> {user.id}
                <Text strong>Email:</Text> {user.email || `@${user.username}` || `Telegram ID: ${user.telegramId}`}
            </Space>
        )
    });

    return (
        <div className="container">
            <TopicBack title="All Users" />
            <div className={styles.all_users}>
                <Search 
                    data={admin.users}
                    setFilteredData={setFilteredUsers}
                    searchFields={['id', 'email', 'username', 'telegramId']}
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
                                <span>
                                    <strong>Role:</strong> {user.role}
                                </span>
                            </div>
                            <div className={styles.user_actions}>
                                <button
                                    className={styles.view_button}
                                    onClick={() => navigate(`/user/${user.id}`)}
                                >
                                    <EyeOutlined /> View Details
                                </button>
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
