import React, { useState, useEffect } from 'react';
import { fetchAllExchangeRequests } from '../../http/exchangeAPI';// API для получения всех возвратов
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import BackButton from '../../components/BackButton/BackButton';
import styles from './AllExchangesPage.module.css';
import { useNavigate } from 'react-router-dom';
import { THING_ROUTE } from '../../utils/consts';

const AllExchangesPage = () => {
    const [exchanges, setExchanges] = useState([]);
    const [searchExchange, setSearchExchange] = useState('');

    const navigate = useNavigate();

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
        <div className={styles.container}>
            <div className={styles.topic_back}>
                <BackButton/>
                <h2>Все обмены</h2>
            </div>
            <div className={styles.search_section}>
                <Form.Control
                    type="text"
                    placeholder="Поиск по номеру обмена"
                    value={searchExchange}
                    onChange={(e) => setSearchExchange(e.target.value)}
                />
            </div>
            <div className={styles.all_exchanges}>
                {filteredExchanges.map(exchangeItem => (
                    <div key={exchangeItem.id} className={styles.exhange_item}>
                        <div className={styles.return_details}>
                            <span>Обмен №{exchangeItem.id}</span>
                            <span onClick={() => navigate(`/user/${exchangeItem.userId}`)} style={{ textDecoration: 'underline' }}>
                            User: <p>{exchangeItem.user.email}</p>
                            </span>
                            <span onClick={() => navigate(THING_ROUTE + "/" + exchangeItem.oldThingId)} style={{ textDecoration: 'underline' }}>
                            Обмен: <p>{exchangeItem.OldThing.name} (${exchangeItem.OldThing.price})</p>
                            </span>
                            <span onClick={() => navigate(THING_ROUTE + "/" + exchangeItem.newThingId)} style={{ textDecoration: 'underline' }}>
                            На: <p>{exchangeItem.NewThing.name} (${exchangeItem.NewThing.price})</p>
                            </span>
                            <span>Причина: <p>{exchangeItem.userComment}</p></span>
                            <span>Разница в цене: <p>${exchangeItem.priceDifference > 0 ? `+${exchangeItem.priceDifference}` : exchangeItem.priceDifference}</p></span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllExchangesPage;
