import React, { useState, useEffect } from 'react';
import { fetchAllOrders } from '../../http/orderAPI'; 
import Form from 'react-bootstrap/Form';
import BackButton from '../../components/BackButton/BackButton';
import styles from './AllOrdersPage.module.css'
import { useNavigate } from 'react-router-dom';
import { THING_ROUTE } from '../../utils/consts';
import CopyableButton from '../../components/CopyableButton/CopyableButton'; 
import { FcClock, FcOk, FcCancel } from 'react-icons/fc';
import { FloatButton } from 'antd';

const AllOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [searchOrder, setSearchOrder] = useState('');

    const navigate = useNavigate()

    useEffect(() => {
        loadOrders();
    }, []);

    // Функция для загрузки всех заказов
    const loadOrders = async () => {
        try {
            const data = await fetchAllOrders();
            setOrders(data);
        } catch (error) {
            console.error('Ошибка при загрузке заказов:', error);
        }
    };

    // Фильтрация заказов по номеру
    const filteredOrders = orders.filter(order => 
        order.id.toString().includes(searchOrder)
    );

    return (
        <div className={styles.container}>
            <div className={styles.topic_back}>
                <BackButton/>
                <h2>Все заказы</h2>
            </div>
            <div className={styles.search_section}>
            <Form.Control
                type="text"
                placeholder="Поиск по номеру заказа"
                value={searchOrder}
                onChange={(e) => setSearchOrder(e.target.value)}
            />
            </div>
            <div className={styles.all_orders}>
                {filteredOrders.map(order => (
                    <div key={order.id} className={styles.order_item}>
                        <div className={styles.order_details}>
                            <span>Заказ №{order.id}</span> 
                            <span 
                            onClick={() => navigate(`/user/${order.userId}`)} 
                            style={{textDecoration: 'underline'}}
                            >
                            User: <p>{order.user.email || `@${order.user.username}` || `Telegram ID: ${order.user.telegramId}`}</p> 
                            </span>
                            {order.promo_code ? (
                                <span>
                                    Promocode: <p>{order.promo_code.code}</p> - <p>{order.promo_code.isPercentage ? `${order.promo_code.discountValue}%` : `$${order.promo_code.discountValue}`}</p>
                                </span>
                            ) : (
                                <></>
                            )}
                            <span>Валюта: <p>{order.cryptoCurrency}</p></span>
                            <div className={styles.hash}>
                            <span>Хэш: </span>
                            {/* Заменяем кнопку копирования на CopyableButton */}
                            <CopyableButton 
                                value={order.cryptoTransactionHash || 'No hash'} 
                                className={styles.copyable_address}
                                title='Copy Hash'
                            />
                            
                            </div>
                            <span>Сумма: <p>{order.cryptoPaymentAmount}</p></span>
                        </div>
                        
                            {order.order_things.map(item => (
                            <span 
                                key={item.id} 
                                className={styles.name_price} 
                                onClick={() => navigate(THING_ROUTE + "/" + item.thingId)}
                            >
                            {item.thing.name} ${item.thing.price}</span>
                            ))}
                            <span>
                                {order.status === 'created' && (
                                    <span className={styles.status}>
                                        <FcClock /> В ожидании
                                    </span>
                                )}
                                {order.status === 'paid' && (
                                    <span className={styles.status}>
                                        <FcOk /> Одобрен
                                    </span>
                                )}
                                {order.status === 'rejected' && (
                                    <span className={styles.status}>
                                        <FcCancel /> Отклонен
                                    </span>
                                )}
                            </span>
                    </div>
                ))}
            </div>
            <FloatButton.BackTop 
                type='dark'
            />
        </div>
    );
};

export default AllOrdersPage;