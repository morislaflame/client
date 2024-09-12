import React, { useState, useEffect } from 'react';
import { fetchAllReturns } from '../../http/orderAPI'; // API для получения всех возвратов
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';

const AllReturnsPage = () => {
    const [returns, setReturns] = useState([]);
    const [searchReturn, setSearchReturn] = useState('');

    useEffect(() => {
        loadReturns();
    }, []);

    // Функция для загрузки всех возвратов
    const loadReturns = async () => {
        try {
            const data = await fetchAllReturns(); // Используем API для получения всех возвратов
            setReturns(data);
        } catch (error) {
            console.error('Ошибка при загрузке возвратов:', error);
        }
    };

    // Фильтрация возвратов по номеру возврата
    const filteredReturns = returns.filter(returnItem => 
        returnItem.id.toString().includes(searchReturn)
    );

    return (
        <div className="container">
            <h2>Все возвраты</h2>
            <Form.Control
                type="text"
                placeholder="Поиск по номеру возврата"
                value={searchReturn}
                onChange={(e) => setSearchReturn(e.target.value)}
            />
            <ListGroup>
                {filteredReturns.map(returnItem => (
                    <ListGroup.Item key={returnItem.id}>
                        Возврат №{returnItem.id}, Статус: {returnItem.status}, Пользователь: {returnItem.user.email}
                        <ul>
                            <li>Товар: {returnItem.order_thing.thing.name}, Цена: {returnItem.order_thing.thing.price}</li>
                            <li>Причина возврата: {returnItem.reason}</li>
                        </ul>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default AllReturnsPage;
