// components/AdminComponents/NewOrders.js

import React, { useEffect, useContext } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { List, message, Button } from 'antd';
import styles from './AdminComponents.module.css';
import { THING_ROUTE } from '../../utils/consts';
import CopyableButton from '../UI/CopyableButton/CopyableButton';

const NewOrders = observer(() => {
  const { admin } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    admin.loadNewOrders();
  }, [admin]);

  const handleConfirmOrder = async (orderId) => {
    try {
      await admin.confirmOrder(orderId);
      message.success('Order confirmed');
      admin.loadNewOrders();
    } catch (error) {
      message.error('Error confirming order');
      console.error('Error confirming order:', error);
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      await admin.rejectOrder(orderId);
      message.success('Order rejected');
      admin.loadNewOrders();
    } catch (error) {
      message.error('Error rejecting order');
      console.error('Error rejecting order:', error);
    }
  };

  return (
    <div className={styles.orders}>
      <h3>New orders</h3>
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
                  <span>Order №{order.id}</span>
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
                  <span className={styles.valuta}>Currency: <strong>{order.cryptoCurrency}</strong></span>
                  <span className={styles.valuta}>Amount: <strong>{order.cryptoPaymentAmount}</strong></span>
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
                  <p style={{ color: 'red' }}>Some items in this order are not available for confirmation.</p>
                )}
                <div className={styles.confirm_reject}>
                  <button
                    onClick={() => admin.showConfirm(
                      'Confirm action',
                      'Are you sure you want to confirm this order?',
                      () => handleConfirmOrder(order.id)
                    )}
                    className={styles.confirm}
                    disabled={hasUnavailableItems}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => admin.showConfirm(
                      'Confirm action',
                      'Are you sure you want to reject this order?',
                      () => handleRejectOrder(order.id)
                    )}
                    className={styles.reject}
                  >
                    Reject
                  </button>
                </div>
              </List.Item>
            );
          }}
        />
      ) : (
        <p>No new orders.</p>
      )}
      <Button onClick={() => navigate('/admin/orders')} className={styles.all_btn}>
        View all orders
      </Button>
    </div>
  );
});

export default NewOrders;
