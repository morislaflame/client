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
import { ExchangeOffcanvas, ExchangeOffcanvasBody, ExchangeOffcanvasHeader } from '../../components/StyledComponents';

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
            message.warning('Select a model to exchange');
            return;
        }
        try {
            await createExchangeRequest(thingId, selectedThingId, userComment);
            message.success('Exchange request successfully sent');
            await user.loadUserInfo(); // Заново загружаем информацию о пользователе
            navigate('/account'); // Перенаправляем на страницу аккаунта пользователя
        } catch (e) {
            console.error('Error when creating an exchange request:', e);
            message.error('Error when creating an exchange request');
        }
    };
    

    const handleCloseOffcanvas = () => {
        setShowOffcanvas(false);
        setSelectedThingId(null);
        setUserComment('');
    };

    return (
        <div className={styles.exchange_page}>
            <h2>Select a Model to Exchange</h2>
            <div className={'mainlist'}>
                <ThingListForExchange selectedThingId={selectedThingId} onSelectThing={setSelectedThingId} />
            </div>

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
                            
                        }} className={styles.button}>
                    
                    Send an exchange request
                    </Button>
                </ExchangeOffcanvasBody>
            </ExchangeOffcanvas>
        </div>
    );
});

export default ExchangePage;
