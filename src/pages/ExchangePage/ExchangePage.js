import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import ThingListForExchange from '../../components/ThingListForExchange/ThingListForExchange';
import { fetchThings } from '../../http/thingAPI';
import Button from 'react-bootstrap/Button';
import { createExchangeRequest } from '../../http/exchangeAPI';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ExchangePage.module.css';

const ExchangePage = observer(() => {
    const { thing } = useContext(Context);
    const [selectedThingId, setSelectedThingId] = useState(null);
    const [userComment, setUserComment] = useState('');
    const navigate = useNavigate();
    const { thingId } = useParams(); // Получаем ID товара, который меняют

    useEffect(() => {
        fetchThings(null, null, 1, 20).then(data => {
            thing.setThings(data.rows);
        });
    }, []);

    const handleSubmitExchange = async () => {
        if (!selectedThingId) {
            alert('Выберите товар для обмена.');
            return;
        }
        try {
            await createExchangeRequest(thingId, selectedThingId, userComment);
            alert('Запрос на обмен успешно отправлен.');
            navigate('/account'); // Перенаправляем на страницу аккаунта пользователя
        } catch (e) {
            alert('Ошибка при создании запроса на обмен.');
        }
    };

    return (
        <div className={styles.exchange_page}>
            <h2>Выберите товар для обмена</h2>
            <div className={'mainlist'}>
            <ThingListForExchange onSelectThing={setSelectedThingId} />
            <textarea 
                placeholder="Комментарий"
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                style={{ width: '100%', marginTop: '20px' }}
            />
            <Button 
                variant="dark" 
                onClick={handleSubmitExchange} 
                disabled={!selectedThingId}
                style={{ marginTop: '20px' }}
            >
                Отправить запрос на обмен
            </Button>
            </div>
            
        </div>
    );
});

export default ExchangePage;
