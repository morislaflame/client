import React, { useState, useEffect } from 'react';
import { fetchAllReturns } from '../../../http/orderAPI'; 
import Form from 'react-bootstrap/Form';
import TopicBack from '../../../components/FuctionalComponents/TopicBack/TopicBack';
import styles from './AllReturnPage.module.css'
import { THING_ROUTE } from '../../../utils/consts';
import { useNavigate } from 'react-router-dom';
import CopyableButton from '../../../components/UI/CopyableButton/CopyableButton'; // Импортируем CopyableButton
import { FcCancel, FcClock, FcOk } from 'react-icons/fc'; // Импортируем иконки
import { FloatButton } from 'antd';

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
            console.error('Ошибка при загрузке возвратов:', error);
        }
    };

    // Фильтрация возвратов по номеру возврата
    const filteredReturns = returns.filter(returnItem => 
        returnItem.id.toString().includes(searchReturn)
    );

    return (
        <div className="container">
            <TopicBack title="Все возвраты" />
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
                            >
                                Модель: <p>{returnItem.thing.name}</p>
                            </span>
                            <span
                                onClick={() => navigate(`/user/${returnItem.userId}`)} 
                                style={{textDecoration: 'underline'}}
                            >
                                User: <p>{returnItem.user.email || `@${returnItem.user.username}` || `Telegram ID: ${returnItem.user.telegramId}`}</p>
                            </span>
                            <span><p>{returnItem.reason}</p></span>
                            
                            {/* Добавленные криптовалютные поля */}
                            <span>Валюта: <p>{returnItem.cryptoCurrency}</p></span>
                            <span>Сумма возврата: <p>{returnItem.refundAmount}</p></span>
                            {returnItem.cryptoTransactionHash && (
                                <div className={styles.hash}>
                                    <span>
                                        Хэш транзакции: </span>
                                    <CopyableButton 
                                        value={returnItem.cryptoTransactionHash} 
                                        className={styles.copyable_address}
                                        title='Скопировать Хэш транзакции'
                                    />
                                </div>  
                            )}
                            {/* Отображение статуса возврата с иконками */}
                            <span>
                                {returnItem.status === 'pending' && (
                                    <span className={styles.status}>
                                        <FcClock /> В ожидании
                                    </span>
                                )}
                                {returnItem.status === 'approved' && (
                                    <span className={styles.status}>
                                        <FcOk /> Одобрен
                                    </span>
                                )}
                                {returnItem.status === 'rejected' && (
                                    <span className={styles.status}>
                                        <FcCancel /> Отклонен
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <FloatButton.BackTop 
                type='dark'
            />
        </div>
    );
};

export default AllReturnsPage;