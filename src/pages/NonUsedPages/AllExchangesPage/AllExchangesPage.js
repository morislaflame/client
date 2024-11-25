import React, { useState, useEffect } from 'react';
import { fetchAllExchangeRequests } from '../../../http/NonUsedAPI/exchangeAPI';
import Form from 'react-bootstrap/Form';
import BackButton from '../../../components/UI/BackButton/BackButton';
import styles from './AllExchangesPage.module.css';
import { useNavigate } from 'react-router-dom';
import { THING_ROUTE } from '../../../utils/consts';
import CopyableButton from '../../../components/UI/CopyableButton/CopyableButton'; // Импортируем CopyableButton
import { FcCancel, FcClock, FcOk } from 'react-icons/fc'; // Импортируем иконки
import { FloatButton } from 'antd';

const AllExchangesPage = () => {
    const [exchanges, setExchanges] = useState([]);
    const [searchExchange, setSearchExchange] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        loadExchanges();
    }, []);

    const loadExchanges = async () => {
        try {
            const data = await fetchAllExchangeRequests(); 
            setExchanges(data);
        } catch (error) {
            console.error('Error loading exchanges:', error);
        }
    };

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
                            User: <p>{exchangeItem.user.email || `@${exchangeItem.user.username}` || `Telegram ID: ${exchangeItem.user.telegramId}`}</p>
                            </span>
                            <span onClick={() => navigate(THING_ROUTE + "/" + exchangeItem.oldThingId)} style={{ textDecoration: 'underline' }}>
                            Обмен: <p>{exchangeItem.OldThing.name} (${exchangeItem.OldThing.price})</p>
                            </span>
                            <span onClick={() => navigate(THING_ROUTE + "/" + exchangeItem.newThingId)} style={{ textDecoration: 'underline' }}>
                            На: <p>{exchangeItem.NewThing.name} (${exchangeItem.NewThing.price})</p>
                            </span>
                            <span><p>{exchangeItem.userComment}</p></span>
                            <span>Разница в цене: <p>${exchangeItem.priceDifference > 0 ? `+${exchangeItem.priceDifference}` : exchangeItem.priceDifference}</p></span>

                            <span>Валюта: <p>{exchangeItem.cryptoCurrency}</p></span>
                            <span>Сумма: <p>{exchangeItem.cryptoPaymentAmount}</p></span>
                            {exchangeItem.cryptoTransactionHash && (
                                <div className={styles.hash}>
                                    <span>Хэш транзакции: </span>
                                    <CopyableButton 
                                        value={exchangeItem.cryptoTransactionHash} 
                                        className={styles.copyable_address}
                                        title='Скопировать Хэш транзакции'
                                    />
                                </div>
                            )}

                            {/* Отображение статуса обмена с иконками */}
                            <span>
                                {exchangeItem.status === 'pending' && (
                                    <span className={styles.status}>
                                        <FcClock /> В ожидании
                                    </span>
                                )}
                                {exchangeItem.status === 'approved' && (
                                    <span className={styles.status}>
                                        <FcOk /> Одобрен
                                    </span>
                                )}
                                {exchangeItem.status === 'rejected' && (
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

export default AllExchangesPage;
