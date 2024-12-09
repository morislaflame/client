import React from 'react';
import { Card, Tag } from 'antd';
import styles from '../UserComponents.module.css';

const ReturnCard = ({ returnItem }) => {
    const getStatusTag = (status) => {
        const statusColors = {
            PENDING: 'orange',
            APPROVED: 'green',
            REJECTED: 'red'
        };

        return <Tag color={statusColors[status]}>{status}</Tag>;
    };

    return (
        <Card 
            className={styles.return_card}
            title={`Возврат #${returnItem.id}`}
            extra={getStatusTag(returnItem.status)}
        >
            <div className={styles.return_info}>
                <p>Заказ: #{returnItem.orderId}</p>
                <p>Сумма возврата: ${returnItem.refundAmountUSD}</p>
                <p>Причина: {returnItem.reason}</p>
                <p>Дата создания: {new Date(returnItem.createdAt).toLocaleDateString()}</p>
                {returnItem.status === 'REJECTED' && returnItem.rejectionReason && (
                    <p>Причина отказа: {returnItem.rejectionReason}</p>
                )}
            </div>
        </Card>
    );
};

export default ReturnCard;