import React from 'react';
import styles from './AdminPage.module.css';
import PendingModels from '../../components/AdminComponents/PendingModels';
import BackButton from '../../components/BackButton/BackButton';
import AdminControls from '../../components/AdminComponents/AdminControls';
import UserSearch from '../../components/AdminComponents/UserSearch';

const AdminPage = () => {
    return <div className={styles.container}>
                <div className={styles.topic_back}>
                    <BackButton />
                    <h2>Admin панель</h2>
                </div>
                <AdminControls />
                <UserSearch />
                <PendingModels />
            </div>;
};

export default AdminPage;