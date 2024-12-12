import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../../../index';
import styles from './SellerInfoComponents.module.css';
import OrderCard from '../../OrderComponents/OrderCard/OrderCard';
import LoadingIndicator from '../../UI/LoadingIndicator/LoadingIndicator';

const SellerOrdersInfo = observer(({ sellerId }) => {
    const { order } = useContext(Context);

    useEffect(() => {
        order.getUserOrders(sellerId);
    }, [sellerId]);

    if (order.loading) {
        return <LoadingIndicator />;
    }

    return (
        <div className={styles.orders_container}>
            <h3>Orders History</h3>
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

export default SellerOrdersInfo;
