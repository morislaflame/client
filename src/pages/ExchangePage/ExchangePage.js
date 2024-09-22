// pages/ExchangePage/ExchangePage.js

import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import ThingListForExchange from '../../components/ThingListForExchange/ThingListForExchange';
import { fetchThings } from '../../http/thingAPI';
import { Button, Offcanvas } from 'react-bootstrap';
import { createExchangeRequest } from '../../http/exchangeAPI';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ExchangePage.module.css';
import { message } from 'antd';

const ExchangePage = observer(() => {
    const { thing, user } = useContext(Context);
    const [selectedThingId, setSelectedThingId] = useState(null);
    const [userComment, setUserComment] = useState('');
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const navigate = useNavigate();
    const { thingId } = useParams(); // ID товара, который пользователь хочет обменять

    useEffect(() => {
        fetchThings(null, null, 1, 20).then(data => {
            thing.setThings(data.rows);
        });
    }, []);

    // Отслеживаем изменение выбранного товара и управляем отображением Offcanvas
    useEffect(() => {
        setShowOffcanvas(selectedThingId !== null);
    }, [selectedThingId]);

    const handleSubmitExchange = async () => {
        if (!selectedThingId) {
            message.warning('Выберите товар для обмена.');
            return;
        }
        try {
            await createExchangeRequest(thingId, selectedThingId, userComment);
            await user.loadUserInfo(); // Заново загружаем информацию о пользователе
            message.success('Запрос на обмен успешно отправлен.');
            navigate('/account'); // Перенаправляем на страницу аккаунта пользователя
        } catch (e) {
            console.error('Ошибка при создании запроса на обмен:', e);
            message.error('Ошибка при создании запроса на обмен.');
        }
    };
    

    const handleCloseOffcanvas = () => {
        setShowOffcanvas(false);
        setSelectedThingId(null);
        setUserComment('');
    };

    return (
        <div className={styles.exchange_page}>
            <h2>Выберите товар для обмена</h2>
            <div className={'mainlist'}>
                <ThingListForExchange selectedThingId={selectedThingId} onSelectThing={setSelectedThingId} />
            </div>

            <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} placement="bottom">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Подтвердите запрос на обмен</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div>
                        <p>Вы выбрали товар для обмена.</p>
                        {/* Здесь можно добавить информацию о выбранном товаре */}
                    </div>
                    <textarea 
                        placeholder="Комментарий"
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        style={{ width: '100%', minHeight: '100px', marginBottom: '20px' }}
                    />
                    <Button 
                        variant="dark" 
                        onClick={handleSubmitExchange} 
                    >
                        Отправить запрос на обмен
                    </Button>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
});

export default ExchangePage;
