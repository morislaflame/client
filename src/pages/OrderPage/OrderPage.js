import React, { useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { Context } from '../../index';
import styles from './OrderPage.module.css';
import TopicBack from '../../components/FuctionalComponents/TopicBack/TopicBack';
import OrderTags from '../../components/UI/OrderTags/OrderTags';
import FormatDate from '../../components/UI/FormatDate/FormatDate';
import SellerInfo from '../../components/OrderComponents/SellerInfo';

const OrderPage = observer(() => {
  const { order } = useContext(Context);
  const { id } = useParams();

  useEffect(() => {
    order.getOrderById(id);
  }, [id]);

  if (!order.currentOrder) {
    return <div>Загрузка...</div>;
  }

  const currentOrder = order.currentOrder;

  return (
    <div className="container">
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <TopicBack title={`Order #${currentOrder.id}`} />
        <div style={{display: 'flex', alignItems: 'center', gap: 'var(--main-gap)'}}>
          <OrderTags status={currentOrder.status} />
          <FormatDate date={currentOrder.createdAt} />
        </div>
      </div>
      <div className="container-item">
          <SellerInfo seller={currentOrder.seller} />

        {currentOrder.modelProduct && (
          <div className={styles.productInfo}>
            <h2>Информация о товаре</h2>
            <p>Название: {currentOrder.modelProduct.name}</p>
            <p>Цена: ${currentOrder.modelProduct.priceUSD}</p>
            {currentOrder.modelProduct.images && 
             currentOrder.modelProduct.images[0] && (
              <img 
                src={process.env.REACT_APP_API_URL + currentOrder.modelProduct.images[0].img}
                alt={currentOrder.modelProduct.name}
                className={styles.productImage}
              />
            )}
          </div>
        )}
      </div>
      <p>Total: ${currentOrder.totalPriceUSD}</p>
    </div>
  );
});

export default OrderPage;
