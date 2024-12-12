import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../../../index';
import styles from './UserInfoComponents.module.css';
import OrderCard from '../../OrderComponents/OrderCard/OrderCard';
import { Spin } from 'antd';

const UserOrdersInfo = observer(({ userId }) => {
    const { order } = useContext(Context);

    useEffect(() => {
        order.getUserOrders(userId);
    }, [userId]);

    if (order.loading) {
        return <Spin tip="Loading orders..." />;
    }

    return (
        <div className={styles.orders_container}>
            <h3>User Orders</h3>
            {order.userOrders.length > 0 ? (
                <div className={styles.orders_list}>
                    {order.userOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            ) : (
                <div className={styles.no_orders}>No orders found</div>
            )}
        </div>
    );
});

export default UserOrdersInfo;
