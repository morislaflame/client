// UserAccount.js

import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { fetchMyInfo } from '../../http/userAPI';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import { EXCHANGE_ROUTE } from '../../utils/consts';
import { useNavigate } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import { createReturn } from '../../http/orderAPI';
import styles from './UserAccount.module.css';
import { GiHighHeel } from "react-icons/gi";
import MyButton from '../../components/MyButton/MyButton';

const UserAccount = observer(() => {
    const { user } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [reasons, setReasons] = useState({});
    const [confirmationMessage, setConfirmationMessage] = useState('');

    const handleClose = () => {
        setShow(false);
        setConfirmationMessage('');
    };

    const handleShow = (order) => {
        setSelectedOrder(order);
        setSelectedItems([]);
        setReasons({});
        setShow(true);
    };

    useEffect(() => {
        const loadUserInfo = async () => {
            try {
                const data = await fetchMyInfo();
                console.log('Получены данные пользователя:', data);
                setUserInfo(data);
            } catch (e) {
                console.error('Ошибка при загрузке данных пользователя:', e);
            } finally {
                setLoading(false);
            }
        };
        loadUserInfo();
    }, []);

    const handleItemSelect = (itemId) => {
        setSelectedItems((prev) =>
            prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
        );
    };

    const handleReasonChange = (itemId, reason) => {
        setReasons((prev) => ({
            ...prev,
            [itemId]: reason,
        }));
    };

    const handleSubmit = async () => {
        try {
            for (const itemId of selectedItems) {
                await createReturn({
                    orderThingId: itemId,
                    reason: reasons[itemId] || '',
                });
            }
            setConfirmationMessage('Возврат оформлен и находится на рассмотрении');
            setTimeout(() => {
                handleClose();
            }, 3000);
        } catch (e) {
            console.error('Ошибка при создании возврата:', e);
            alert('Возникла ошибка при оформлении возврата');
        }
    };

    const handleExchangeRequest = (item) => {
        navigate(EXCHANGE_ROUTE.replace(':orderThingId', item.id), { state: { orderThingId: item.id } });
    };

    if (loading) {
        return <Spinner animation="border" />;
    }

    if (!userInfo) {
        return <p>Не удалось загрузить информацию о пользователе.</p>;
    }

    return (
        <div className={styles.useraccount}>
            <div className={styles.topic}>
                <h2>Личный кабинет</h2>
                <div className={styles.userinfo}>
                    <p>Email: {userInfo.email}</p>
                    <p>Роль: {userInfo.role}</p>
                </div>
            </div>

            {/* Раздел заказов */}
            <div className={styles.orders}>
                <h3>Мои заказы</h3>
                {userInfo.orders.length > 0 ? (
                    <div className={styles.order_list}>
                        {userInfo.orders.map(order => (
                            <div className={styles.order_item} key={order.id}>
                                <div className={styles.order_status}><span>Заказ №{order.id}</span> <span>Статус: {order.status}</span></div>
                                <div className={styles.ladies}>
                                    {order.order_things.map(item => {
                                        const hasExchangeRequest = userInfo.exchangeRequests?.some(
                                            exchange => exchange.oldThingId === item.thing.id && exchange.status === 'pending'
                                        );

                                        return (
                                            <div className={styles.name_price} key={item.id}>
                                                <div className={styles.name_heel}>
                                                    <GiHighHeel />
                                                    модель:<b>{item.thing.name}</b>
                                                </div>
                                                <span>${item.thing.price}</span>
                                                {item.thing.ownerId === userInfo.id && (
                                                    hasExchangeRequest ? (
                                                        <Button
                                                            variant="secondary"
                                                            disabled
                                                            style={{ marginLeft: '10px' }}
                                                        >
                                                            Обмен запрошен
                                                        </Button>
                                                    ) : (
                                                        <MyButton
                                                            variant="primary"
                                                            onClick={() => handleExchangeRequest(item)}
                                                            text="Запросить обмен"
                                                        />
                                                    )
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className={styles.total_price}>Итого: ${order.totalPrice} </div>
                                <Button variant="dark" onClick={() => handleShow(order)}>
                                    Оформить возврат
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>У вас нет заказов.</p>
                )}
            </div>

            {/* Раздел возвратов */}
            <div className={styles.returns}>
                <h3>Мои возвраты</h3>
                {userInfo.returns.length > 0 ? (
                    <div className={styles.order_list}>
                        {userInfo.returns.map(returnItem => (
                            <div className={styles.order_item} key={returnItem.id}>
                                <div className={styles.order_status}> <span>Возврат №{returnItem.id}</span> <span>Статус: {returnItem.status}</span> </div>
                                <div className={styles.ladies}>
                                    <div className={styles.name_price}>
                                        <div className={styles.name_heel}>
                                            <GiHighHeel />
                                            модель: {returnItem.order_thing.thing.name}
                                        </div>
                                        <span>${returnItem.order_thing.thing.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>У вас нет возвратов.</p>
                )}
            </div>

            {/* Раздел запросов на обмен */}
            <div className={styles.exchanges}>
                <h3>Мои запросы на обмен</h3>
                {userInfo.exchangeRequests && userInfo.exchangeRequests.length > 0 ? (
                    <div className={styles.exchange_list}>
                        {userInfo.exchangeRequests.map(exchange => (
                            <div className={styles.exchange_item} key={exchange.id}>
                                <div className={styles.exchange_status}>
                                    <span>Обмен №{exchange.id}</span>
                                    <span>Статус: {exchange.status}</span>
                                </div>
                                <div className={styles.exchange_details}>
                                    <div>
                                        <strong>Старый товар:</strong> {exchange.OldThing.name} - ${exchange.OldThing.price}
                                    </div>
                                    <div>
                                        <strong>Новый товар:</strong> {exchange.NewThing.name} - ${exchange.NewThing.price}
                                    </div>
                                    <div>
                                        <strong>Разница в цене:</strong> ${exchange.priceDifference}
                                    </div>
                                    {exchange.status === 'pending' && (
                                        <p>Ваш запрос на обмен находится на рассмотрении.</p>
                                    )}
                                    {exchange.status === 'approved' && (
                                        <p>Ваш запрос на обмен одобрен.</p>
                                    )}
                                    {exchange.status === 'rejected' && (
                                        <p>Ваш запрос на обмен отклонен.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>У вас нет запросов на обмен.</p>
                )}
            </div>

            {/* Offcanvas для возвратов */}
            <Offcanvas show={show} onHide={handleClose} placement="bottom">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className={styles.offcanv_header}>Оформить возврат</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {selectedOrder && (
                        <>
                            <h4>Заказ №{selectedOrder.id}</h4>
                            <ul>
                                {selectedOrder.order_things.map(item => (
                                    <li key={item.id}>
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.id)}
                                            onChange={() => handleItemSelect(item.id)}
                                        />
                                        {item.thing.name} — {item.thing.price} руб.
                                        {selectedItems.includes(item.id) && (
                                            <textarea
                                                placeholder="Причина возврата"
                                                value={reasons[item.id] || ''}
                                                onChange={(e) => handleReasonChange(item.id, e.target.value)}
                                                style={{ display: 'block', marginTop: '10px' }}
                                            />
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <Button onClick={handleSubmit} disabled={selectedItems.length === 0}>
                                Оформить возврат
                            </Button>
                            {confirmationMessage && <p>{confirmationMessage}</p>}
                        </>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
});

export default UserAccount;
