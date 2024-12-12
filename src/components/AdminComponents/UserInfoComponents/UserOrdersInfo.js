import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../../../index';
import styles from './UserInfoComponents.module.css';
import OrderCard from '../../OrderComponents/OrderCard/OrderCard';
import { Space, Typography } from 'antd';
import Search from '../../UI/Search/Search';
import LoadingIndicator from '../../UI/LoadingIndicator/LoadingIndicator';

const { Text } = Typography;

const UserOrdersInfo = observer(({ userId }) => {
    const { order } = useContext(Context);
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        order.getUserOrders(userId);
    }, [userId]);

    const formatOrderOption = (order) => ({
        value: order.id.toString(),
        label: (
            <Space>
                <Text strong>Order #:</Text> {order.id}
                <Text strong>Model:</Text> {order.modelProduct?.name}
                <Text strong>Price:</Text> ${order.totalPriceUSD}
            </Space>
        )
    });

    if (order.loading) {
        return <LoadingIndicator />;
    }

    return (
        <div className={styles.orders_container}>
            <h3>User Orders</h3>
            <Search 
                data={order.userOrders}
                setFilteredData={setFilteredOrders}
                searchFields={['id', 'modelProduct.name']}
                placeholder="Search by order ID or model name"
                formatOption={formatOrderOption}
            />
            {filteredOrders.length > 0 ? (
                <div className={styles.orders_list}>
                    {filteredOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            ) : (
                <div className={styles.no_orders}>
                    {order.userOrders.length > 0 ? 'No orders found' : 'No orders'}
                </div>
            )}
        </div>
    );
});

export default UserOrdersInfo;
