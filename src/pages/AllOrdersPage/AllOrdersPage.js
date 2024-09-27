import React, { useState, useEffect } from 'react';
import { fetchAllOrders } from '../../http/orderAPI'; // API для получения всех заказов
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import BackButton from '../../components/BackButton/BackButton';

const AllOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [searchOrder, setSearchOrder] = useState('');

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
        <div className="container">
            <div className={'topic_back'}>
                <BackButton/>
                <h2>Все заказы</h2>
            </div>
            <Form.Control
                type="text"
                placeholder="Поиск по номеру заказа"
                value={searchOrder}
                onChange={(e) => setSearchOrder(e.target.value)}
            />
            <ListGroup>
                {filteredOrders.map(order => (
                    <ListGroup.Item key={order.id}>
                        Заказ №{order.id}, Статус: {order.status}, Сумма: ${order.totalPrice}, 
                        Пользователь:{order.user.email}
                        <ul>
                            {order.order_things.map(item => (
                                <li key={item.id}>Товар: {item.thing.name}, Цена: {item.thing.price}</li>
                            ))}
                        </ul>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default AllOrdersPage;
