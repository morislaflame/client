import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById } from '../../http/userAPI';
import ListGroup from 'react-bootstrap/ListGroup';
import BackButton from '../../components/BackButton/BackButton';

const UserInfoPage = () => {
    const { id } = useParams(); // Получаем id пользователя из URL
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUserById(id); // Получаем информацию о пользователе по id
                setUser(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };
        fetchUserData();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div>
            <div className={'topic_back'}>
                <BackButton/>
                <h2>User Info</h2>
            </div>
            
            <p>Email: {user.email}</p>
            <p>Роль: {user.role}</p>

            <h3>Заказы</h3>
            {user.orders.length > 0 ? (
                <ListGroup>
                    {user.orders.map(order => (
                        <ListGroup.Item key={order.id}>
                            Заказ #{order.id} — Статус: {order.status}
                            <ul>
                                {order.order_things.map(thing => (
                                    <li key={thing.id}>{thing.thing.name} — ${thing.thing.price}</li>
                                ))}
                            </ul>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <p>Нет заказов</p>
            )}

            <h3>Корзина</h3>
            {user.basket && user.basket.basket_things.length > 0 ? (
                <ListGroup>
                    {user.basket.basket_things.map(basketThing => (
                        <ListGroup.Item key={basketThing.id}>
                            {basketThing.thing.name} — ${basketThing.thing.price}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <p>Корзина пуста</p>
            )}

            <h3>Возвраты</h3>
            {user.returns.length > 0 ? (
                <ListGroup>
                    {user.returns.map(returnRequest => (
                        <ListGroup.Item key={returnRequest.id}>
                            Товар: {returnRequest.thing.name} — Причина возврата: {returnRequest.reason}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <p>Нет возвратов</p>
            )}
        </div>
    );
};

export default UserInfoPage;
