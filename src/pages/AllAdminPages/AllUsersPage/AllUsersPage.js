import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../../index';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { FloatButton, Button } from 'antd';
import TopicBack from '../../../components/FuctionalComponents/TopicBack/TopicBack';
import styles from './AllUsersPage.module.css';
import LoadingIndicator from '../../../components/UI/LoadingIndicator/LoadingIndicator';
import Search from '../../../components/UI/Search/Search';
import { EyeOutlined } from '@ant-design/icons';

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
            <div className="search_options">
                <span className="search_options_label">ID: {user.id}</span>
                <span className="search_options_label">Email: {user.email || `@${user.username}` || `Telegram ID: ${user.telegramId}`}</span>
            </div>
        )
    });

    return (
        <div className="container">
            <TopicBack title="All Users" />
            <div className="container-item">
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
                                <Button
                                    type="primary"
                                    onClick={() => navigate(`/user/${user.id}`)}
                                >
                                    <EyeOutlined /> View Details
                                </Button>
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
