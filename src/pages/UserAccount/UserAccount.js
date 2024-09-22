// components/UserAccount/UserAccount.js

import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { Spinner, Button, Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createReturn } from '../../http/orderAPI';
import styles from './UserAccount.module.css';
import { GiHighHeel } from "react-icons/gi";
import { Dropdown, Menu, message } from 'antd';
import { LiaExchangeAltSolid } from "react-icons/lia";
import { IoReturnDownBackOutline } from "react-icons/io5";
import { FcCancel, FcClock, FcOk } from "react-icons/fc";
import { SlOptions } from "react-icons/sl";

const UserAccount = observer(() => {
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [selectedThing, setSelectedThing] = useState(null); // Выбранный товар для возврата
    const [reason, setReason] = useState('');
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [openDropdowns, setOpenDropdowns] = useState({});

    const handleClose = () => {
        setShow(false);
        setConfirmationMessage('');
        setReason('');
    };

    const handleShow = (thing) => {
        setSelectedThing(thing);
        setShow(true);
    };

    const handleDropdownVisibleChange = (flag, thingId) => {
        setOpenDropdowns(prevState => ({
            ...prevState,
            [thingId]: flag,
        }));
    };

    useEffect(() => {
        user.loadUserInfo();
    }, [user]);

    const handleMenuClick = (action, thingItem) => {
        if (action === 'exchange') {
            handleExchangeRequest(thingItem);
        } else if (action === 'return') {
            handleShow(thingItem);
        }
    };

    const handleExchangeRequest = (thingItem) => {
        navigate(`/exchange/${thingItem.id}`); // Перенаправляем на страницу обмена, передавая ID товара
    };

    const handleSubmitReturn = async () => {
        try {
            await createReturn({
                thingId: selectedThing.id,
                reason: reason || '',
            });
            await user.loadUserInfo(); // Заново загружаем информацию о пользователе
            message.success('Возврат оформлен и находится в обработке');
            setTimeout(() => {
                handleClose();
            }, 3000);
        } catch (e) {
            console.error('Ошибка при создании возврата:', e);
            message.error('Ошибка при создании возврата');
        }
    };
    

    const getDropdownMenu = (thingItem, hasExchangeRequest, hasReturnRequest) => (
        <Menu>
            <Menu.Item
                key="exchange"
                icon={<LiaExchangeAltSolid />}
                disabled={hasExchangeRequest}
                onClick={() => handleMenuClick('exchange', thingItem)}
            >
                {hasExchangeRequest ? 'Запрос на обмен отправлен' : 'Запросить обмен'}
            </Menu.Item>
            <Menu.Item
                key="return"
                icon={<IoReturnDownBackOutline />}
                disabled={hasReturnRequest}
                onClick={() => handleMenuClick('return', thingItem)}
            >
                {hasReturnRequest ? 'Возврат в обработке' : 'Оформить возврат'}
            </Menu.Item>
        </Menu>
    );

    if (user.loading) {
        return <Spinner animation="border" />;
    }

    if (!user.userInfo) {
        return <p>Не удалось загрузить информацию о пользователе.</p>;
    }

    return (
        <div className={styles.useraccount}>

            <div className={styles.topic}>
                <h2>Личный кабинет</h2>
                <div className={styles.userinfo}>
                    <p>Email: {user.userInfo.email}</p>
                    <p>Роль: {user.userInfo.role}</p>
                </div>
            </div>

            {/* Товары пользователя */}
            <div className={styles.my_things}>
                <h3>Мои модели</h3>
                {user.userInfo.ownedThings && user.userInfo.ownedThings.length > 0 ? (
                    <div className={styles.things_list}>
                        {user.userInfo.ownedThings.map(thingItem => {
                            const hasExchangeRequest = user.userInfo.exchangeRequests?.some(
                                exchange => exchange.oldThingId === thingItem.id && exchange.status === 'pending'
                            );

                            const hasReturnRequest = user.userInfo.returns?.some(
                                returnItem => returnItem.thingId === thingItem.id && returnItem.status === 'pending'
                            );

                            return (
                                <div className={styles.thing_item} key={thingItem.id}>
                                    <div className={styles.thing_image_wrapper}>
                                        {thingItem.images && thingItem.images.length > 0 && (
                                            <img
                                                src={`${process.env.REACT_APP_API_URL}/${thingItem.images[0].img}`}
                                                alt={thingItem.name}
                                                className={styles.thing_image}
                                                onError={(e) => { e.target.src = '/path/to/default/image.jpg'; }}
                                            />
                                        )}
                                    </div>
                                    <div className={styles.thing_details}>
                                        <div className={styles.name_price}>
                                            <div className={styles.name_heel}>
                                                <GiHighHeel /><span>{thingItem.name}</span>
                                            </div>
                                            <span>${thingItem.price}</span>
                                        </div>
                                        <div className={styles.dropdownmenusection}>
                                            <Dropdown
                                                overlay={getDropdownMenu(thingItem, hasExchangeRequest, hasReturnRequest)}
                                                trigger={['click']}
                                                onVisibleChange={(flag) => handleDropdownVisibleChange(flag, thingItem.id)}
                                                visible={openDropdowns[thingItem.id] || false}
                                            >
                                                <div className={styles.dropdownmenu}>
                                                    <div onClick={e => e.preventDefault()} className={styles.dropdownTrigger}>
                                                        <span>Действия</span>
                                                        <SlOptions
                                                            className={`${styles.rotateIcon} ${openDropdowns[thingItem.id] ? styles.open : ''}`}
                                                        />
                                                    </div>
                                                </div>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p>У вас нет купленных моделей.</p>
                )}
            </div>

            {/* Раздел заказов */}
            <div className={styles.orders}>
                <h3>Мои заказы</h3>
                {user.userInfo.orders && user.userInfo.orders.length > 0 ? (
                    <div className={styles.order_list}>
                        {user.userInfo.orders.map(order => (
                            <div className={styles.order_item} key={order.id}>
                                <div className={styles.order_status}>
                                    <span>Заказ №{order.id}</span> <span>{order.status}</span>
                                </div>
                                <div className={styles.order_details}>
                                    <div className={styles.ladies}>
                                        {order.order_things.map(item => (
                                            <div className={styles.name_price} key={item.id}>
                                                <div className={styles.name_heel}>
                                                    <GiHighHeel />
                                                    модель: <b>{item.thing.name}</b>
                                                </div>
                                                <span>${item.thing.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.total_price}>Итого: ${order.totalPrice} </div>
                                    <div className={styles.mini_status}>
                                        {order.status === 'created' && (
                                            <div className={styles.approved}><FcClock style={{ color: 'black' }} /><p>Ваш заказ ожидает подтверждения</p></div>
                                        )}
                                        {order.status === 'paid' && (
                                            <div className={styles.approved}><FcOk /><p>Ваш заказ оплачен</p></div>
                                        )}
                                        {order.status === 'rejected' && (
                                            <div className={styles.approved}><FcCancel /><p>Ваш заказ отклонен</p></div>
                                        )}
                                    </div>
                                </div>
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
                {user.userInfo.returns && user.userInfo.returns.length > 0 ? (
                    <div className={styles.order_list}>
                        {user.userInfo.returns.map(returnItem => (
                            <div className={styles.order_item} key={returnItem.id}>
                                <div className={styles.order_status}>
                                    <span>Возврат №{returnItem.id}</span> <span>{returnItem.status}</span>
                                </div>
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
                <h3>Мои обмены</h3>
                {user.userInfo.exchangeRequests && user.userInfo.exchangeRequests.length > 0 ? (
                    <div className={styles.exchange_list}>
                        {user.userInfo.exchangeRequests.map(exchange => (
                            <div className={styles.exchange_item} key={exchange.id}>
                                <div className={styles.exchange_status}>
                                    <span>Обмен №{exchange.id}</span>
                                    <span> {exchange.status}</span>
                                </div>
                                <div className={styles.exchange_details}>
                                    <div className={styles.old_new}>
                                        <div className={styles.old_new_names}>
                                            <div><strong>Обменяно:</strong></div> {exchange.OldThing.name} - ${exchange.OldThing.price}
                                        </div>
                                        <div className={styles.old_new_names}>
                                            <div><strong>На:</strong></div> {exchange.NewThing.name} - ${exchange.NewThing.price}
                                        </div>
                                    </div>

                                    <div>
                                        <strong>Разница в цене:</strong> ${exchange.priceDifference}
                                    </div>
                                    <div className={styles.mini_status}>
                                        {exchange.status === 'pending' && (
                                            <p>Ваш запрос на обмен находится в обработке.</p>
                                        )}
                                        {exchange.status === 'approved' && (
                                            <div className={styles.approved}><FcOk /><p>Ваш запрос на обмен одобрен.</p></div>
                                        )}
                                        {exchange.status === 'rejected' && (
                                            <div className={styles.approved}><FcCancel /><p>Ваш запрос на обмен отклонен.</p></div>
                                        )}
                                    </div>
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
