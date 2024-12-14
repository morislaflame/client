import React from 'react';
import TopicBack from '../../components/FuctionalComponents/TopicBack/TopicBack';
import PendingModels from '../../components/AdminComponents/PendingModelsComponents/PendingModels';
import AdminControls from '../../components/AdminComponents/AdminControls';
import UserSearch from '../../components/AdminComponents/UserSearch';
import PendingOrders from '../../components/AdminComponents/PendingOrdersComponents/PendingOrders';
const AdminPage = () => {
    return <div className="container">
                <TopicBack title="Admin панель" />
                <div className="container-item">
                    <AdminControls />
                    <UserSearch />
                    <PendingModels />
                    <PendingOrders />
                </div>
            </div>;
};

export default AdminPage;