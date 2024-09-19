// UserAccount.js

// UserAccount.js

import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { fetchMyInfo } from '../../http/userAPI';
import { Spinner, Button, Offcanvas } from 'react-bootstrap';
import { EXCHANGE_ROUTE } from '../../utils/consts';
import { useNavigate } from 'react-router-dom';
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
    const [selectedThing, setSelectedThing] = useState(null); // Выбранный товар для возврата
    const [reason, setReason] = useState('');
    const [confirmationMessage, setConfirmationMessage] = useState('');

    const handleClose = () => {
        setShow(false);
        setConfirmationMessage('');
        setReason('');
    };

    const handleShow = (thing) => {
        setSelectedThing(thing);
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

    const handleSubmitReturn = async () => {
        try {
            await createReturn({
                thingId: selectedThing.id,
                reason: reason || '',
            });
            setConfirmationMessage('Возврат оформлен и находится на рассмотрении');
            setTimeout(() => {
                handleClose();
            }, 3000);
        } catch (e) {
            console.error('Ошибка при создании возврата:', e);
            alert('Возникла ошибка при оформлении возврата');
        }
    };

    const handleExchangeRequest = (thing) => {
        navigate(EXCHANGE_ROUTE.replace(':thingId', thing.id), { state: { thingId: thing.id } });
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

            {/* Товары пользователя */}
            <div className={styles.my_things}>
                <h3>Мои товары</h3>
                {userInfo.ownedThings && userInfo.ownedThings.length > 0 ? (
                    <div className={styles.things_list}>
                        {userInfo.ownedThings.map(thing => {
                            const hasExchangeRequest = userInfo.exchangeRequests?.some(
                                exchange => exchange.oldThingId === thing.id && exchange.status === 'pending'
                            );

                            const hasReturnRequest = userInfo.returns?.some(
                                returnItem => returnItem.thingId === thing.id && returnItem.status === 'pending'
                            );

                            return (
                                <div className={styles.thing_item} key={thing.id}>
                                    
                                        <div className={styles.thing_image}>
                                            {thing.images && thing.images.length > 0 && (
                                                <img src={process.env.REACT_APP_API_URL + thing.images[0].image} alt={thing.name} />
                                            )}
                                        </div>
                                        <div className={styles.thing_details}>
                                            <h5>{thing.name}</h5>
                                            <p>Цена: ${thing.price}</p>
                                            <div className={styles.thing_buttons}>
                                                {hasExchangeRequest ? (
                                                    <Button variant="secondary" disabled>
                                                        Обмен запрошен
                                                    </Button>
                                                ) : (
                                                    <Button variant="primary" onClick={() => handleExchangeRequest(thing)}>
                                                        Запросить обмен
                                                    </Button>
                                                )}
                                                {hasReturnRequest ? (
                                                    <Button variant="secondary" disabled>
                                                        Возврат оформлен
                                                    </Button>
                                                ) : (
                                                    <Button variant="danger" onClick={() => handleShow(thing)}>
                                                        Оформить возврат
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p>У вас нет приобретенных товаров.</p>
                )}
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
                                                
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className={styles.total_price}>Итого: ${order.totalPrice} </div>
                                
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
                                            модель: {returnItem.thing.name}
                                        </div>
                                        <span>${returnItem.thing.price}</span>
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

            <Offcanvas show={show} onHide={handleClose} placement="bottom">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className={styles.offcanv_header}>Оформить возврат</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {selectedThing && (
                        <>
                            <h4>{selectedThing.name}</h4>
                            <p>Цена: ${selectedThing.price}</p>
                            <textarea
                                placeholder="Причина возврата"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                style={{ width: '100%', minHeight: '100px', marginBottom: '10px' }}
                            />
                            <Button onClick={handleSubmitReturn}>
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





