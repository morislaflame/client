// components/AdminComponents/NewOrders.js

import React, { useEffect, useContext } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { List, message, Button } from 'antd';
import styles from './AdminComponents.module.css';
import { THING_ROUTE } from '../../utils/consts';
import CopyableButton from '../CopyableButton/CopyableButton';

const NewOrders = observer(() => {
  const { admin } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    admin.loadNewOrders();
  }, [admin]);

  const handleConfirmOrder = async (orderId) => {
    try {
      await admin.confirmOrder(orderId);
      message.success('Заказ подтвержден');
      admin.loadNewOrders();
    } catch (error) {
      message.error('Ошибка при подтверждении заказа');
      console.error('Ошибка при подтверждении заказа:', error);
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      await admin.rejectOrder(orderId);
      message.success('Заказ отклонен');
      admin.loadNewOrders();
    } catch (error) {
      message.error('Ошибка при отклонении заказа');
      console.error('Ошибка при отклонении заказа:', error);
    }
  };

  return (
    <div className={styles.orders}>
      <h3>Новые заказы</h3>
      {admin.newOrders.length > 0 ? (
        <List
          dataSource={admin.newOrders}
          renderItem={(order) => {
            const hasUnavailableItems = order.order_things.some(
              (item) => item.thing.status !== 'available'
            );
            return (
              <List.Item className={styles.order_item}>
                <div className={styles.order_details}>
                  <span>Заказ №{order.id}</span>
                  <span
                    onClick={() => navigate(`/user/${order.userId}`)}
                    style={{ textDecoration: 'underline' }}
                  >
                    User: <p>{order.user.email || `@${order.user.username}` || `Telegram ID: ${order.user.telegramId}`}</p>
                  </span>
                  {order.promo_code && (
                    <span>
                      Promocode: <p>{order.promo_code.code}</p> - <p>{order.promo_code.isPercentage ? `${order.promo_code.discountValue}%` : `$${order.promo_code.discountValue}`}</p>
                    </span>
                  )}
                  <div className={styles.order_things}>
                    {order.order_things.map((item) => (
                      <span
                        key={item.id}
                        className={styles.name_price}
                        onClick={() => navigate(THING_ROUTE + "/" + item.thingId)}
                      >
                        {item.thing.name} ${item.thing.price}
                      </span>
                    ))}
                    <span className={styles.total_price}>Total: ${order.totalPrice}</span>
                  </div>
                </div>

                <div className={styles.refund_section}>
                  <span className={styles.valuta}>Валюта: <strong>{order.cryptoCurrency}</strong></span>
                  <span className={styles.valuta}>Сумма: <strong>{order.cryptoPaymentAmount}</strong></span>
                  <div className={styles.hash}>
                    <span>Transaction Hash:</span>
                    <CopyableButton
                      value={order.cryptoTransactionHash}
                      className={styles.copyable_address}
                      title='Copy Hash'
                    />
                  </div>
                </div>
                {hasUnavailableItems && (
                  <p style={{ color: 'red' }}>Некоторые товары в этом заказе недоступны для подтверждения.</p>
                )}
                <div className={styles.confirm_reject}>
                  <button
                    onClick={() => admin.showConfirm(
                      'Подтвердите действие',
                      'Вы уверены, что хотите подтвердить этот заказ?',
                      () => handleConfirmOrder(order.id)
                    )}
                    className={styles.confirm}
                    disabled={hasUnavailableItems}
                  >
                    Подтвердить
                  </button>
                  <button
                    onClick={() => admin.showConfirm(
                      'Подтвердите действие',
                      'Вы уверены, что хотите отклонить этот заказ?',
                      () => handleRejectOrder(order.id)
                    )}
                    className={styles.reject}
                  >
                    Отклонить
                  </button>
                </div>
              </List.Item>
            );
          }}
        />
      ) : (
        <p>Нет новых заказов.</p>
      )}
      <Button onClick={() => navigate('/admin/orders')} className={styles.all_btn}>
        Посмотреть все заказы
      </Button>
    </div>
  );
});

export default NewOrders;
