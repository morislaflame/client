import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import styles from './SellerComponents.module.css';
import { Spin } from 'antd';
import SellerOrderItem from './SellerOrderItem';

const SellerOrders = observer(() => {
    const { seller } = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMyOrders = async () => {
            setLoading(true);
            try {
                await seller.loadMyOrders();
            } catch (error) {
                console.error('Error loading seller orders:', error);
            } finally {
                setLoading(false);
            }
        };
        loadMyOrders();
    }, [seller.myOrders]);

    return <div className={styles.seller_orders}>
        {loading ? <Spin /> : 
            seller.myOrders && seller.myOrders.length > 0 ? 
                seller.myOrders.map((order) => 
                    <SellerOrderItem key={order.id} order={order} />
                ) : 
                <div>No orders found</div>
        }
    </div>;
});

export default SellerOrders;