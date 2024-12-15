import React, { useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { Context } from '../../index';
import styles from './OrderPage.module.css';
import TopicBack from '../../components/FuctionalComponents/TopicBack/TopicBack';
import OrderTags from '../../components/UI/OrderTags/OrderTags';
import FormatDate from '../../components/UI/FormatDate/FormatDate';
import SellerInfo from '../../components/OrderComponents/SellerInfo';
import OrderModel from '../../components/OrderComponents/OrderModel';

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
          <OrderModel modelProduct={currentOrder.modelProduct} />
        )}
      </div>
      <p>Total: ${currentOrder.totalPriceUSD}</p>
    </div>
  );
});

export default OrderPage;
