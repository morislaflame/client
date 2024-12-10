import React from 'react';
import styles from './SellerComponents.module.css';
import { Tag } from 'antd';

const getStatusColor = (status) => {
    switch (status) {
        case 'CREATED':
            return 'default';
        case 'PAID':
            return 'processing';
        case 'COMPLETED':
            return 'success';
        case 'RETURN_PENDING':
            return 'warning';
        case 'RETURN_REJECTED':
            return 'error';
        case 'RETURN_APPROVED':
            return 'warning';
        case 'CLOSED':
            return 'default';
        default:
            return 'default';
    }
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
};

const SellerOrderItem = ({ order }) => {
    return (
        <div className={styles.seller_order_item}>
            <div className={styles.order_header}>
                <span>Order #{order.id}</span>
                <Tag color={getStatusColor(order.status)}>{order.status}</Tag>
            </div>
            <div className={styles.order_details}>
                <div className={styles.order_info}>
                    <p>Model: {order.modelProduct?.name}</p>
                    <p>Price: ${order.totalPriceUSD}</p>
                    <p>Created: {formatDate(order.createdAt)}</p>
                    {order.payedAt && <p>Paid: {formatDate(order.payedAt)}</p>}
                    {order.completedAt && <p>Completed: {formatDate(order.completedAt)}</p>}
                </div>
                {order.returns && order.returns.length > 0 && (
                    <div className={styles.returns_info}>
                        <h4>Returns:</h4>
                        {order.returns.map(returnItem => (
                            <div key={returnItem.id} className={styles.return_item}>
                                <Tag color={getStatusColor(returnItem.status)}>{returnItem.status}</Tag>
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
