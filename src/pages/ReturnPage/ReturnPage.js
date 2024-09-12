import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchOrderDetails, createReturn } from '../../http/orderAPI';

const ReturnPage = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [reasons, setReasons] = useState({}); // Храним причину для каждого выбранного товара
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrder = async () => {
            try {
                const data = await fetchOrderDetails(orderId);
                setOrder(data);
            } catch (e) {
                console.error('Ошибка при загрузке заказа:', e);
            } finally {
                setLoading(false);
            }
        };
        loadOrder();
    }, [orderId]);

    const handleItemSelect = (itemId) => {
        setSelectedItems((prev) =>
            prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
        );
    };

    const handleReasonChange = (itemId, reason) => {
        setReasons((prev) => ({
            ...prev,
            [itemId]: reason,
        }));
    };

    const handleSubmit = async () => {
        try {
            for (const itemId of selectedItems) {
                await createReturn({
                    orderThingId: itemId,
                    reason: reasons[itemId] || '', // Если причина не указана, передаем пустую строку
                });
            }
            alert('Возврат успешно оформлен');
        } catch (e) {
            console.error('Ошибка при создании возврата:', e);
            alert('Возникла ошибка при оформлении возврата');
        }
    };

    if (loading) {
        return <p>Загрузка заказа...</p>;
    }

    if (!order || !order.order_things || order.order_things.length === 0) {
        return <p>Нет доступных товаров для возврата.</p>;
    }

    return (
        <div>
            <h2>Оформление возврата для заказа №{order.id}</h2>
            <ul>
                {order.order_things.map((item) => (
                    <li key={item.id}>
                        <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleItemSelect(item.id)}
                        />
                        {item.thing.name} — {item.thing.price} руб.
                        {selectedItems.includes(item.id) && (
                            <textarea
                                placeholder="Причина возврата"
                                value={reasons[item.id] || ''}
                                onChange={(e) => handleReasonChange(item.id, e.target.value)}
                                style={{ display: 'block', marginTop: '10px' }}
                            />
                        )}
                    </li>
                ))}
            </ul>
            <button onClick={handleSubmit} disabled={selectedItems.length === 0}>
                Оформить возврат
            </button>
        </div>
    );
};

export default ReturnPage;
