import React from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../../../index';
import { Tag } from 'antd';
import styles from './SellerInfoComponents.module.css';

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
    return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const SellerOrdersInfo = observer(() => {
    const { seller } = useContext(Context);
    const orders = seller.sellerInfo?.sellerOrders || [];

    return (
        <div className={styles.orders_container}>
            <h3>Orders History</h3>
            {orders.length > 0 ? (
                <div className={styles.orders_list}>
                    {orders.map((order) => (
                        <div key={order.id} className={styles.order_card}>
                            <div className={styles.order_header}>
                                <div className={styles.order_id}>
                                    Order #{order.id}
                                </div>
                                <Tag color={getStatusColor(order.status)}>
                                    {order.status}
                                </Tag>
                            </div>

                            <div className={styles.order_details}>
                                <div className={styles.order_info}>
                                    <p>
                                        <strong>Model:</strong> {order.modelProduct?.name}
                                    </p>
                                    <p>
                                        <strong>Price:</strong> ${order.totalPriceUSD}
                                    </p>
                                    <p>
                                        <strong>Created:</strong> {formatDate(order.createdAt)}
                                    </p>
                                    {order.payedAt && (
                                        <p>
                                            <strong>Paid:</strong> {formatDate(order.payedAt)}
                                        </p>
                                    )}
                                    {order.completedAt && (
                                        <p>
                                            <strong>Completed:</strong> {formatDate(order.completedAt)}
                                        </p>
                                    )}
                                    {order.closedAt && (
                                        <p>
                                            <strong>Closed:</strong> {formatDate(order.closedAt)}
                                        </p>
                                    )}
                                </div>

                                {order.returns && order.returns.length > 0 && (
                                    <div className={styles.returns_info}>
                                        <h4>Returns:</h4>
                                        {order.returns.map(returnItem => (
                                            <div key={returnItem.id} className={styles.return_item}>
                                                <Tag color={getStatusColor(returnItem.status)}>
                                                    {returnItem.status}
                                                </Tag>
                                                <p>
                                                    <strong>Reason:</strong> {returnItem.reason}
                                                </p>
                                                <p>
                                                    <strong>Refund Amount:</strong> ${returnItem.refundAmountUSD}
                                                </p>
                                                <p>
                                                    <strong>Created:</strong> {formatDate(returnItem.createdAt)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.no_orders}>No orders found</div>
            )}
        </div>
    );
});

export default SellerOrdersInfo;
