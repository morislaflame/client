import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import ThingListForExchange from '../../components/ThingListForExchange/ThingListForExchange';
import { fetchThings } from '../../http/thingAPI';
import Button from 'react-bootstrap/Button';
import { createExchangeRequest } from '../../http/exchangeAPI';
import { useNavigate, useParams } from 'react-router-dom';

const ExchangePage = observer(() => {
    const { thing } = useContext(Context);
    const [selectedThingId, setSelectedThingId] = useState(null);
    const [userComment, setUserComment] = useState('');
    const navigate = useNavigate();
    const { orderThingId } = useParams(); // Получаем ID товара из заказа, который меняют

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
            await createExchangeRequest(orderThingId, selectedThingId, userComment);
            alert('Запрос на обмен успешно отправлен.');
            navigate('/my-orders'); // Перенаправляем на страницу заказов
        } catch (e) {
            alert('Ошибка при создании запроса на обмен.');
        }
    };

    return (
        <div>
            <h2>Выберите товар для обмена</h2>
            <ThingListForExchange onSelectThing={setSelectedThingId} />
            <textarea 
                placeholder="Комментарий"
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                style={{ width: '100%', marginTop: '20px' }}
            />
            <Button 
                variant="primary" 
                onClick={handleSubmitExchange} 
                disabled={!selectedThingId}
                style={{ marginTop: '20px' }}
            >
                Отправить запрос на обмен
            </Button>
        </div>
    );
});

export default ExchangePage;
