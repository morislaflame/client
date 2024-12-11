import React from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../../../index';
import styles from './SellerInfoComponents.module.css';
import OrderCard from '../../OrderComponents/OrderCard/OrderCard';

const SellerOrdersInfo = observer(({ sellerId }) => {
    const { seller } = useContext(Context);
    const orders = seller.sellerInfo?.sellerOrders || [];

    return (
        <div className={styles.orders_container}>
            <h3>Orders History</h3>
            {orders.length > 0 ? (
                <div className={styles.orders_list}>
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            ) : (
                <div className={styles.no_orders}>No orders found</div>
            )}
        </div>
    );
});

export default SellerOrdersInfo;
