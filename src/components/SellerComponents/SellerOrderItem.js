import React from 'react';
import styles from './SellerComponents.module.css';
import { Tag } from 'antd';
import OrderTags from '../UI/OrderTags/OrderTags';
import FormatDate from '../UI/FormatDate/FormatDate';

const SellerOrderItem = ({ order }) => {
    return (
        <div className={styles.seller_order_item}>
            <div className={styles.order_header}>
                <span>Order #{order.id}</span>
                <OrderTags status={order.status} />
            </div>
            <div className={styles.order_details}>
                <div className={styles.order_info}>
                    <p>Model: {order.modelProduct?.name}</p>
                    <p>Price: ${order.totalPriceUSD}</p>
                    <p>Created: <FormatDate date={order.createdAt} /></p>
                    {order.payedAt && <p>Paid: <FormatDate date={order.payedAt} /></p>}
                    {order.completedAt && <p>Completed: <FormatDate date={order.completedAt} /></p>}
                </div>
                {order.returns && order.returns.length > 0 && (
                    <div className={styles.returns_info}>
                        <h4>Returns:</h4>
                        {order.returns.map(returnItem => (
                            <div key={returnItem.id} className={styles.return_item}>
                                <OrderTags status={returnItem.status} />
                                <p>Reason: {returnItem.reason}</p>
                                <p>Refund Amount: ${returnItem.refundAmountUSD}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerOrderItem;
