import React, { useState, useEffect } from 'react';
import { fetchAllReturns } from '../../http/orderAPI'; // API для получения всех возвратов
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import BackButton from '../../components/BackButton/BackButton';

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
            console.error('Error loading returns:', error);
        }
    };

    // Фильтрация возвратов по номеру возврата
    const filteredReturns = returns.filter(returnItem => 
        returnItem.id.toString().includes(searchReturn)
    );

    return (
        <div className="container">
            <div className={'topic_back'}>
                <BackButton/>
                <h2>Все возвраты</h2>
            </div>
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
                            <li>Товар: {returnItem.thing.name}, Цена: {returnItem.thing.price}</li>
                            <li>Причина возврата: {returnItem.reason}</li>
                        </ul>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default AllReturnsPage;
