import React, { useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import styles from './OrderPage.module.css';
import TopicBack from '../../components/FuctionalComponents/TopicBack/TopicBack';
import { Tag, Button } from 'antd';
import OrderTags from '../../components/UI/OrderTags/OrderTags';
import FormatDate from '../../components/UI/FormatDate/FormatDate';
import { SELLER_INFO_ROUTE } from '../../utils/consts';

const OrderPage = observer(() => {
  const { order } = useContext(Context);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    order.getOrderById(id);
  }, [id]);

  if (!order.currentOrder) {
    return <div>Загрузка...</div>;
  }

  const currentOrder = order.currentOrder;

  return (
    <div className="container">
      <TopicBack title={`Order #${currentOrder.id}`} />
      <div className={styles.orderDetails}>
      <div className={styles.orderInfo}>
                <div className={styles.orderId}>
                  <h3>Order #{currentOrder.id}</h3>
                  <OrderTags status={currentOrder.status} />
                </div>
                <div className={styles.orderTotal}>
                  <p>Total: ${currentOrder.totalPriceUSD}</p>
                  <FormatDate date={currentOrder.createdAt} />
                </div>
                <div className={styles.orderSeller}>
                  <span>Seller: {currentOrder.seller.email}</span>
                  <Button 
                    type="ghost"
                    onClick={() => navigate(`${SELLER_INFO_ROUTE}/${currentOrder.seller.id}`)}
                  >
                    View profile
                  </Button>
                </div>
              </div>

        {currentOrder.modelProduct && (
          <div className={styles.productInfo}>
            <h2>Информация о товаре</h2>
            <p>Название: {currentOrder.modelProduct.name}</p>
            <p>Цена: ${currentOrder.modelProduct.priceUSD}</p>
            {currentOrder.modelProduct.images && 
             currentOrder.modelProduct.images[0] && (
              <img 
                src={process.env.REACT_APP_API_URL + currentOrder.modelProduct.images[0].url}
                alt={currentOrder.modelProduct.name}
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
