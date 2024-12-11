import React, { useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { Context } from '../../index';
import styles from './OrderPage.module.css';
import TopicBack from '../../components/FuctionalComponents/TopicBack/TopicBack';
const OrderPage = observer(() => {
  const { order } = useContext(Context);
  const { id } = useParams();

  useEffect(() => {
    order.getOrderById(id);
  }, [id]);

  if (!order.currentOrder) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="container">
      <TopicBack title={`Order #${order.currentOrder.id}`} />
      <div className={styles.orderDetails}>
        <div className={styles.mainInfo}>
          <h2>Основная информация</h2>
          <p>Статус: {order.currentOrder.status}</p>
          <p>Сумма заказа: ${order.currentOrder.totalPriceUSD}</p>
          {order.currentOrder.discountAmountUSD > 0 && (
            <p>Скидка: ${order.currentOrder.discountAmountUSD}</p>
          )}
          <p>Дата создания: {new Date(order.currentOrder.createdAt).toLocaleDateString()}</p>
        </div>

        {order.currentOrder.modelProduct && (
          <div className={styles.productInfo}>
            <h2>Информация о товаре</h2>
            <p>Название: {order.currentOrder.modelProduct.name}</p>
            <p>Цена: ${order.currentOrder.modelProduct.priceUSD}</p>
            {order.currentOrder.modelProduct.images && 
             order.currentOrder.modelProduct.images[0] && (
              <img 
                src={process.env.REACT_APP_API_URL + order.currentOrder.modelProduct.images[0].url}
                alt={order.currentOrder.modelProduct.name}
                className={styles.productImage}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default OrderPage;
