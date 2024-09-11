import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { fetchMyInfo } from '../../http/userAPI'; // Метод для получения информации о пользователе
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';

const UserAccount = observer(() => {
    const { user } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);

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
                                    </li>
                                ))}
                            </ul>
                            Общая стоимость: {order.totalPrice}
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
        </div>
    );
});

export default UserAccount;
