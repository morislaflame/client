// components/Admin/NewOrders.js

import React, { useEffect, useContext, useCallback } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { message } from 'antd';
import { THING_ROUTE, ALL_ORDERS_ROUTE } from '../../utils/consts';
import styles from './AdminComponents.module.css';

const NewOrders = observer(() => {
  const { order } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    order.loadNewOrders(); // Метод в OrderStore для загрузки новых заказов
  }, [order]);

  const handleConfirmOrder = useCallback(async (orderId) => {
    try {
      await order.confirmExistingOrder(orderId); // Исправлено имя метода
      message.success('Заказ подтвержден');
    } catch (error) {
      message.error('Ошибка при подтверждении заказа');
      console.error('Ошибка при подтверждении заказа:', error);
    }
  }, [order]);

  const handleRejectOrder = useCallback(async (orderId) => {
    try {
      await order.rejectExistingOrder(orderId); // Исправлено имя метода
      message.success('Заказ отклонен');
    } catch (error) {
      message.error('Ошибка при отклонении заказа');
      console.error('Ошибка при отклонении заказа:', error);
    }
  }, [order]);

  const copyToClipboard = useCallback(async (hash, orderId) => {
    try {
      await navigator.clipboard.writeText(hash);
      message.success('Скопировано');
    } catch (error) {
      message.error('Не удалось скопировать' + error);
    }
  }, []);

  if (order.loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div className={styles.orders}>
      <h3>Новые заказы</h3>
      {order.newOrders.length > 0 ? (
        <ListGroup style={{ width: '100%' }}>
          {order.newOrders.map((orderItem) => {
            // Проверка статуса товаров в заказе
            const hasUnavailableItems = orderItem.order_things.some(
              (item) => item.thing.status !== 'available'
            );
            return (
              <ListGroup.Item key={orderItem.id} className={styles.order_item}>
                <div className={styles.order_details}>
                  <span>Заказ №{orderItem.id}</span>
                  <span
                    onClick={() => navigate(`/user/${orderItem.userId}`)}
                    style={{ textDecoration: 'underline' }}
                  >
                    User: <p>{orderItem.user.email}</p>
                  </span>
                  {orderItem.promo_code ? (
                    <span>
                      Promocode: <p>{orderItem.promo_code.code}</p> -{' '}
                      <p>${orderItem.promo_code.discountValue}</p>
                    </span>
                  ) : null}
                  <span>
                    Валюта: <p>{orderItem.cryptoCurrency}</p>
                  </span>
                  <span>
                    Хэш:
                    <button
                      className={styles.copyableHash}
                      onClick={() =>
                        copyToClipboard(orderItem.cryptoTransactionHash, orderItem.id)
                      }
                    >
                      {orderItem.cryptoTransactionHash}
                    </button>
                  </span>
                  <span>
                    Сумма: <p>{orderItem.cryptoPaymentAmount}</p>
                  </span>
                </div>

                {orderItem.order_things.map((item) => (
                  <span
                    key={item.id}
                    className={styles.name_price}
                    onClick={() => navigate(THING_ROUTE + '/' + item.thingId)}
                  >
                    {item.thing.name} ${item.thing.price}
                  </span>
                ))}

                {hasUnavailableItems && (
                  <p style={{ color: 'red' }}>
                    Некоторые товары в этом заказе недоступны для подтверждения.
                  </p>
                )}
                <div className={styles.confirm_reject}>
                  <button
                    onClick={() => handleConfirmOrder(orderItem.id)}
                    className={styles.confirm}
                    disabled={hasUnavailableItems}
                  >
                    Подтвердить
                  </button>
                  <button
                    onClick={() => handleRejectOrder(orderItem.id)}
                    className={styles.reject}
                  >
                    Отклонить
                  </button>
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      ) : (
        <p>Нет новых заказов.</p>
      )}
      <Button
        onClick={() => navigate(ALL_ORDERS_ROUTE)}
        className={styles.all_btn}
      >
        Посмотреть все заказы
      </Button>
    </div>
  );
});

export default NewOrders;
