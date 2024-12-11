import React, { useEffect, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { useNavigate } from 'react-router-dom';
import { ORDER_ROUTE, SELLER_INFO_ROUTE } from '../../utils/consts';
import styles from './AllUserOrdersPage.module.css';
import TopicBack from '../../components/FuctionalComponents/TopicBack/TopicBack';
import { Tag, Button, Space, Typography } from 'antd';
import Search from '../../components/UI/Search/Search';

const { Text } = Typography;

const AllUserOrdersPage = observer(() => {
  const { order } = useContext(Context);
  const navigate = useNavigate();
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    order.loadMyOrders();
  }, []);

  useEffect(() => {
    setFilteredOrders(order.orders);
  }, [order.orders]);

  const handleSearch = (value) => {
    if (value) {
      const filtered = order.orders.filter(o => 
        o.id.toString().includes(value) ||
        o.modelProduct?.name?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(order.orders);
    }
  };

  const formatOrderOption = (order) => ({
    value: order.id.toString(),
    label: (
      <Space>
        <Text strong>Order #:</Text> {order.id}
        <Text strong>Model:</Text> {order.modelProduct?.name}
        <Text strong>Price:</Text> ${order.totalPriceUSD}
      </Space>
    )
  });

  const getStatusColor = (status) => {
    switch (status) {
        case 'CREATED':
            return 'blue';
        case 'PAID':
            return 'orange';
        case 'COMPLETED':
            return 'green';
        case 'RETURN_PENDING':
            return 'orange';
        case 'RETURN_REJECTED':
            return 'red';
        case 'RETURN_APPROVED':
            return 'green';
        case 'CLOSED':
            return 'gray';
        default:
            return 'gray';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container">
      <TopicBack title="My Orders" />
      <Search 
        data={order.orders}
        onSearch={handleSearch}
        placeholder="Enter order number"
        formatOption={formatOrderOption}
      />
      {filteredOrders.length === 0 ? (
        <p>You have no orders yet</p>
      ) : (
        <div className={styles.ordersList}>
          {filteredOrders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderInfo}>
                <div className={styles.orderId}>
                  <h3>Order #{order.id}</h3>
                  <Tag color={getStatusColor(order.status)}>{order.status}</Tag>
                </div>
                <div className={styles.orderTotal}>
                  <p>Total: ${order.totalPriceUSD}</p>
                  <p>{formatDate(order.createdAt)}</p>
                </div>
                <div className={styles.orderSeller}>
                  <span>Seller: {order.seller.email}</span>
                  <Button 
                    type="ghost"
                    onClick={() => navigate(`${SELLER_INFO_ROUTE}/${order.seller.id}`)}
                  >
                    View profile
                  </Button>
                </div>
              </div>
              
              {order.modelProduct && (
                <div className={styles.productInfo}>
                  {order.modelProduct.images && order.modelProduct.images[0] && (
                    <img 
                      src={process.env.REACT_APP_API_URL + order.modelProduct.images[0].img}
                      alt={order.modelProduct.name}
                      className={styles.productImage}
                    />
                  )}
                  <div className={styles.productParams}>
                    <span>Model: {order.modelProduct.name}</span>
                  </div>
                </div>
              )}

              <Button 
                type="primary"
                className={styles.viewButton}
                onClick={() => navigate(`${ORDER_ROUTE}/${order.id}`)}
              >
                View details
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default AllUserOrdersPage;
