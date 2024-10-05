import React, { useState, useEffect } from 'react';
import { fetchAllOrders } from '../../http/orderAPI'; // API для получения всех заказов
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import BackButton from '../../components/BackButton/BackButton';
import styles from './AllOrdersPage.module.css'
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { THING_ROUTE } from '../../utils/consts';


const AllOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [searchOrder, setSearchOrder] = useState('');
    const [copiedOrderId, setCopiedOrderId] = useState(null)

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

    const copyToClipboard = async (hash, orderId) => {
        try {
          await navigator.clipboard.writeText(hash);
          setCopiedOrderId(orderId);
          message.success('Скопирован');
          setTimeout(() => {
            setCopiedOrderId(null);
          }, 2000);
        } catch (error) {
          message.error('Не удалось скопировать' + error)
        }
      }

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
                            User: <p>{order.user.email}</p> 
                            </span>
                            {order.promo_code ? (
                                <span>
                                    Promocode: <p>{order.promo_code.code}</p> - <p>${order.promo_code.discountValue}</p>
                                </span>
                            ) : (
                                <></>
                            )}
                            <span>Валюта: <p>{order.cryptoCurrency}</p></span>
                            <span>Хэш: 
                            <button
                                className={styles.copyableHash}
                                onClick={() => copyToClipboard(order.cryptoTransactionHash, order.id)}
                            >
                                {order.cryptoTransactionHash}
                            </button> 
                            </span>
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllOrdersPage;
