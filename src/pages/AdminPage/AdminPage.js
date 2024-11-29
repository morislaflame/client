import React from 'react';
import TopicBack from '../../components/FuctionalComponents/TopicBack/TopicBack';
import PendingModels from '../../components/AdminComponents/PendingModels';
import AdminControls from '../../components/AdminComponents/AdminControls';
import UserSearch from '../../components/AdminComponents/UserSearch';

const AdminPage = () => {
    return <div className="container">
                <TopicBack title="Admin панель" />
                <AdminControls />
                <UserSearch />
                <PendingModels />
            </div>;
};

export default AdminPage;