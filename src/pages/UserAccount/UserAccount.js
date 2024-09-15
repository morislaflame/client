import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { fetchMyInfo } from '../../http/userAPI'; // Метод для получения информации о пользователе
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import { EXCHANGE_ROUTE, RETURN_PAGE } from '../../utils/consts';
import { useNavigate } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import { createReturn } from '../../http/orderAPI';

const UserAccount = observer(() => {
    const { user } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const [show, setShow] = useState(false); // Управление Offcanvas
    const [selectedOrder, setSelectedOrder] = useState(null); // Выбранный заказ
    const [selectedItems, setSelectedItems] = useState([]); // Выбранные товары
    const [reasons, setReasons] = useState({}); // Причины возврата для товаров
    const [confirmationMessage, setConfirmationMessage] = useState('');

    const handleClose = () => {
        setShow(false);
        setConfirmationMessage(''); // Сбрасываем сообщение после закрытия
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
                    reason: reasons[itemId] || '', // Причина возврата
                });
            }
            setConfirmationMessage('Возврат оформлен и находится на рассмотрении');
            setTimeout(() => {
                handleClose(); // Закрываем Offcanvas через 3 секунды
            }, 3000); // Задержка в 3 секунды
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
        <div className="container">
            <h2>Личный кабинет</h2>
            <p>Email: {userInfo.email}</p>
            <p>Роль: {userInfo.role}</p>

            <h3>Мои заказы</h3>
            {userInfo.orders.length > 0 ? (
                <ListGroup>
                    {userInfo.orders.map(order => (
                        <ListGroup.Item key={order.id}>
                            Заказ №{order.id}, Статус: {order.status}
                            <ul>
                                {order.order_things.map(item => (
                                    <li key={item.id}>
                                        Товар: {item.thing.name}, Цена: {item.thing.price}
                                        <Button
                                            variant="primary"
                                            onClick={() => handleExchangeRequest(item)}
                                            style={{ marginLeft: '10px' }}
                                        >
                                            Запросить обмен
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                            Общая стоимость: {order.totalPrice}
                            <Button variant="primary" onClick={() => handleShow(order)}>
                                Оформить возврат
                            </Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <p>У вас нет заказов.</p>
            )}

            <h3>Мои возвраты</h3>
            {userInfo.returns.length > 0 ? (
                <ListGroup>
                    {userInfo.returns.map(returnItem => (
                        <ListGroup.Item key={returnItem.id}>
                            Возврат №{returnItem.id}, Статус: {returnItem.status}
                            <ul>
                                <li>Товар: {returnItem.order_thing.thing.name}, Цена: {returnItem.order_thing.thing.price}</li>
                            </ul>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <p>У вас нет возвратов.</p>
            )}

            <Offcanvas show={show} onHide={handleClose} placement="bottom">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Оформить возврат</Offcanvas.Title>
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
                        </>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
});

export default UserAccount;
