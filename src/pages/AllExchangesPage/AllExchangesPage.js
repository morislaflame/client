import React, { useState, useEffect } from 'react';
import { fetchAllExchangeRequests } from '../../http/exchangeAPI';// API для получения всех возвратов
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import BackButton from '../../components/BackButton/BackButton';

const AllExchangesPage = () => {
    const [exchanges, setExchanges] = useState([]);
    const [searchExchange, setSearchExchange] = useState('');

    useEffect(() => {
        loadExchanges();
    }, []);

    // Функция для загрузки всех возвратов
    const loadExchanges = async () => {
        try {
            const data = await fetchAllExchangeRequests(); 
            setExchanges(data);
        } catch (error) {
            console.error('Error loading exchanges:', error);
        }
    };

    // Фильтрация возвратов по номеру возврата
    const filteredExchanges = exchanges.filter(exchangeItem => 
        exchangeItem.id.toString().includes(searchExchange)
    );

    return (
        <div className="container">
            <div className={'topic_back'}>
                <BackButton/>
                <h2>Все обмены</h2>
            </div>
            <Form.Control
                type="text"
                placeholder="Поиск по номеру обмена"
                value={searchExchange}
                onChange={(e) => setSearchExchange(e.target.value)}
            />
            <ListGroup>
                {filteredExchanges.map(exchangeItem => (
                    <ListGroup.Item key={exchangeItem.id}>
                        Обмен №{exchangeItem.id}, Статус: {exchangeItem.status}, Пользователь: {exchangeItem.user.email}
                        <ul>
                            <li>Обменял: {exchangeItem.OldThing.name}, Цена: {exchangeItem.OldThing.price}</li>
                            <li>На: {exchangeItem.NewThing.name}, Цена: {exchangeItem.NewThing.price}</li>
                            <li>Причина обмена: {exchangeItem.userComment}</li>
                            <li>Разница в цене: {exchangeItem.priceDifference}</li>
                        </ul>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default AllExchangesPage;
