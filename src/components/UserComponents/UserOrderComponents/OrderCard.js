import React, { useState } from 'react';
import { Card, Button, Modal, Input, Tag, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from '../UserComponents.module.css';

const OrderCard = ({ order, onCreateReturn }) => {
    const [returnModalVisible, setReturnModalVisible] = useState(false);
    const [returnReason, setReturnReason] = useState('');
    const navigate = useNavigate();

    const getStatusTag = (status) => {
        const statusColors = {
            CREATED: 'blue',
            PAID: 'green',
            COMPLETED: 'purple',
            RETURN_PENDING: 'orange',
            RETURN_APPROVED: 'red',
            RETURN_REJECTED: 'gray'
        };

        return <Tag color={statusColors[status]}>{status}</Tag>;
    };

    const handleCreateReturn = () => {
        if (!returnReason.trim()) {
            message.error('Укажите причину возврата');
            return;
        }
        onCreateReturn(order.id, returnReason);
        setReturnModalVisible(false);
        setReturnReason('');
    };

    return (
        <>
            <Card 
                className={styles.order_card}
                title={`Заказ #${order.id}`}
                extra={getStatusTag(order.status)}
            >
                <div className={styles.order_info}>
                    <p>Сумма: ${order.totalPriceUSD}</p>
                    <p>Дата: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div className={styles.order_actions}>
                    <Button 
                        type="primary" 
                        onClick={() => navigate(`/order/${order.id}`)}
                    >
                        Подробнее
                    </Button>
                    {order.status === 'COMPLETED' && (
                        <Button 
                            type="default" 
                            onClick={() => setReturnModalVisible(true)}
                        >
                            Возврат
                        </Button>
                    )}
                </div>
            </Card>

            <Modal
                title="Создание возврата"
                open={returnModalVisible}
                onOk={handleCreateReturn}
                onCancel={() => setReturnModalVisible(false)}
            >
                <Input.TextArea
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    placeholder="Укажите причину возврата"
                    rows={4}
                />
            </Modal>
        </>
    );
};

export default OrderCard;