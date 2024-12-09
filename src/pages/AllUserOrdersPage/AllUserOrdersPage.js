import React, { useEffect, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { Tabs, Spin, Empty, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './AllUserOrdersPage.module.css';
import OrderCard from '../../components/UserComponents/UserOrderComponents/OrderCard';
import ReturnCard from '../../components/UserComponents/UserOrderComponents/ReturnCard';
import TopicBack from '../../components/FuctionalComponents/TopicBack/TopicBack';

const { TabPane } = Tabs;

const AllUserOrdersPage = observer(() => {
    const { order } = useContext(Context);
    const [activeTab, setActiveTab] = useState('1');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                order.loadMyOrders(),
                order.loadMyReturns()
            ]);
        } catch (error) {
            console.error('Error loading orders:', error);
            message.error('Ошибка при загрузке заказов');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateReturn = async (orderId, reason) => {
        try {
            await order.createReturn(orderId, reason);
            message.success('Возврат успешно создан');
            await order.loadMyReturns();
        } catch (error) {
            console.error('Error creating return:', error);
            message.error('Ошибка при создании возврата');
        }
    };

    const renderOrders = () => {
        if (order.orders.length === 0) {
            return <Empty description="У вас пока нет заказов" />;
        }

        return (
            <div className={styles.orders_grid}>
                {order.orders.map(orderItem => (
                    <OrderCard 
                        key={orderItem.id}
                        order={orderItem}
                        onCreateReturn={handleCreateReturn}
                    />
                ))}
            </div>
        );
    };

    const renderReturns = () => {
        if (order.returns.length === 0) {
            return <Empty description="У вас пока нет возвратов" />;
        }

        return (
            <div className={styles.returns_grid}>
                {order.returns.map(returnItem => (
                    <ReturnCard 
                        key={returnItem.id}
                        returnItem={returnItem}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className={styles.loading_container}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className='container'>
            <TopicBack title="My Orders" />
            
            <Tabs 
                activeKey={activeTab} 
                onChange={setActiveTab}
                className={styles.tabs}
            >
                <TabPane tab="Orders" key="1">
                    {renderOrders()}
                </TabPane>
                <TabPane tab="Returns" key="2">
                    {renderReturns()}
                </TabPane>
            </Tabs>
        </div>
    );
});

export default AllUserOrdersPage;
