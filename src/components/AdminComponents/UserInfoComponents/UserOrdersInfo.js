import React from 'react';
import styles from './UserInfoComponents.module.css';

const UserOrdersInfo = ({ orders }) => {
    return (
        <div className={styles.orders}>
            <h3>User Orders</h3>
            {orders.length > 0 ? (
                orders.map(order => (
                    <div key={order.id} className={styles.order}>
                        <span>Order ID: {order.id}</span>
                        <span>Status: {order.status}</span>
                        <span>Total: ${order.totalPriceUSD}</span>
                    </div>
                ))
            ) : (
                <p>No orders found</p>
            )}
        </div>
    );
};

export default UserOrdersInfo;
