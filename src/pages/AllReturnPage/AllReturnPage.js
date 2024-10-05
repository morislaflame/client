import React, { useState, useEffect } from 'react';
import { fetchAllReturns } from '../../http/orderAPI'; // API для получения всех возвратов
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import BackButton from '../../components/BackButton/BackButton';
import styles from './AllReturnPage.module.css'
import { message } from 'antd';
import { THING_ROUTE } from '../../utils/consts';
import { useNavigate } from 'react-router-dom';


const AllReturnsPage = () => {
    const [returns, setReturns] = useState([]);
    const [searchReturn, setSearchReturn] = useState('');

    const navigate = useNavigate()

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
        <div className={styles.container}>
            <div className={styles.topic_back}>
                <BackButton/>
                <h2>Все возвраты</h2>
            </div>
            <div className={styles.search_section}>
                <Form.Control
                    type="text"
                    placeholder="Поиск по номеру возврата"
                    value={searchReturn}
                    onChange={(e) => setSearchReturn(e.target.value)}
                />
            </div>
            <div className={styles.all_returns}>
                {filteredReturns.map(returnItem => (
                    <div key={returnItem.id} className={styles.return_item}>
                    <div className={styles.return_details}>
                      <span>Возврат №{returnItem.id}</span>
                      <span 
                        onClick={() => navigate(THING_ROUTE + "/" + returnItem.thingId)} 
                        style={{textDecoration: 'underline'}}
                      >Модель: <p>{returnItem.thing.name}</p></span>
                      <span
                        onClick={() => navigate(`/user/${returnItem.userId}`)} 
                        style={{textDecoration: 'underline'}}
                      >User: <p>{returnItem.user.email}</p></span>
                      <span>Причина: <p>{returnItem.reason}</p></span>
                    </div>
                  </div>
                ))}
            </div>
        </div>
    );
};

export default AllReturnsPage;
