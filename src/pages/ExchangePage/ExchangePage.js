// src/pages/ExchangePage/ExchangePage.js

import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import ThingListForExchange from '../../components/ThingListForExchange/ThingListForExchange';
import { fetchThings, fetchOneThing } from '../../http/thingAPI';
import { Button, Offcanvas } from 'react-bootstrap';
import { createExchangeRequest } from '../../http/exchangeAPI';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ExchangePage.module.css';
import { message } from 'antd';
import { ExchangeOffcanvas, ExchangeOffcanvasBody, ExchangeOffcanvasHeader } from '../../components/StyledComponents';
import { PAYMENT_ROUTE } from '../../utils/consts';
import BackButton from '../../components/BackButton/BackButton';
import Pages from '../../components/Pages';
import FaqAccordion from '../../components/FaqAccordion/FaqAccordion';

const ExchangePage = observer(() => {
    const { thing, user } = useContext(Context);
    const [selectedThingId, setSelectedThingId] = useState(null);
    const [userComment, setUserComment] = useState('');
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const navigate = useNavigate();
    const { thingId } = useParams(); // ID товара, который пользователь хочет обменять

    const [currentThing, setCurrentThing] = useState(null); // Текущий товар пользователя
    const [selectedThing, setSelectedThing] = useState(null); // Выбранный для обмена товар

    useEffect(() => {
        fetchThings(null, null, 1, 20).then(data => {
            thing.setThings(data.rows);
        });

        // Загружаем текущий товар пользователя
        fetchOneThing(thingId).then(data => {
            setCurrentThing(data);
        });
    }, [thingId]);

    // Отслеживаем изменение выбранного товара и управляем отображением Offcanvas
    useEffect(() => {
        if (selectedThingId) {
            // Загружаем информацию о выбранном товаре
            fetchOneThing(selectedThingId).then(data => {
                setSelectedThing(data);
                setShowOffcanvas(true);
            });
        } else {
            setSelectedThing(null);
            setShowOffcanvas(false);
        }
    }, [selectedThingId]);

    const handleSubmitExchange = async () => {
        if (!selectedThingId) {
            message.warning('Select a model to exchange');
            return;
        }

        if (!currentThing || !selectedThing) {
            message.error('Error loading item information');
            return;
        }

        const priceDifference = selectedThing.price - currentThing.price;

        if (priceDifference > 0) {
            // Требуется доплата, перенаправляем на PaymentPage
            navigate(PAYMENT_ROUTE, {
                state: {
                    exchange: true,
                    thingId,
                    selectedThingId,
                    userComment,
                    priceDifference,
                },
            });
        } else {
            // Доплата не требуется, создаем запрос на обмен
            try {
                await createExchangeRequest(thingId, selectedThingId, userComment);
                message.success('Exchange request successfully sent');
                await user.loadUserInfo(); // Заново загружаем информацию о пользователе
                navigate('/account'); // Перенаправляем на страницу аккаунта пользователя
            } catch (e) {
                console.error('Error when creating an exchange request:', e);
                message.error('Error when creating an exchange request');
            }
        }
    };

    const handleCloseOffcanvas = () => {
        setShowOffcanvas(false);
        setSelectedThingId(null);
        setUserComment('');
    };

    return (
        <div className={styles.exchange_page}>
            <div className={styles.topic_back}><BackButton/><h2>Exchange</h2></div>
            <div className={'mainlist'}>
                <ThingListForExchange selectedThingId={selectedThingId} onSelectThing={setSelectedThingId} />
                <Pages/>
            </div>
            <FaqAccordion/>

            <ExchangeOffcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} placement="bottom">
                <ExchangeOffcanvasHeader>
                    <Offcanvas.Title>Confirm exchange request</Offcanvas.Title>
                </ExchangeOffcanvasHeader>
                <ExchangeOffcanvasBody>
                    <div className={styles.selection}>
                        <div>
                            <p>Describe the reason</p>
                            {/* Здесь можно добавить информацию о выбранном товаре */}
                        </div>
                        <textarea
                            placeholder="Comment"
                            value={userComment}
                            onChange={(e) => setUserComment(e.target.value)}
                            style={{ width: '100%', minHeight: '100px', marginBottom: '20px' }}
                        />
                    </div>
                    <Button
                        variant="dark"
                        onClick={handleSubmitExchange}
                        style={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '7px',
                        }}
                        className={styles.button}
                    >
                        {selectedThing && currentThing && selectedThing.price - currentThing.price > 0
                            ? 'Proceed to Payment'
                            : 'Send an exchange request'}
                    </Button>
                </ExchangeOffcanvasBody>
            </ExchangeOffcanvas>
        </div>
    );
});

export default ExchangePage;
