import React, { useEffect, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { useNavigate } from 'react-router-dom';
import { ORDER_ROUTE, SELLER_INFO_ROUTE } from '../../utils/consts';
import styles from './AllUserOrdersPage.module.css';
import TopicBack from '../../components/FuctionalComponents/TopicBack/TopicBack';
import { Tag, Button, AutoComplete, Space, Typography, Spin } from 'antd';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';

const { Text } = Typography;

const AllUserOrdersPage = observer(() => {
  const { order } = useContext(Context);
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    order.loadMyOrders();
  }, []);

  useEffect(() => {
    if (orderId) {
      const filtered = order.orders
        .filter(o => o.id.toString().includes(orderId))
        .slice(0, 5);
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders([]);
    }
  }, [orderId, order.orders]);

  const handleSearch = (id) => {
    if (!id) return;
    setIsSearching(true);
    try {
      const foundOrder = order.orders.find(o => o.id.toString() === id);
      if (foundOrder) {
        navigate(`${ORDER_ROUTE}/${id}`);
      }
    } catch (error) {
      console.error('Error finding order:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const autoCompleteOptions = filteredOrders.map(o => ({
    value: o.id.toString(),
    label: (
      <Space>
        <Text strong>Order #:</Text> {o.id}
        <Text strong>Model:</Text> {o.modelProduct?.name}
        <Text strong>Price:</Text> ${o.totalPriceUSD}
      </Space>
    ),
  }));

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
      
      {/* Поиск заказов */}
      <div className={styles.search_section}>
        <AutoComplete
          style={{ width: '100%' }}
          options={autoCompleteOptions}
          value={orderId}
          onChange={setOrderId}
          onSelect={handleSearch}
          placeholder="Enter order number"
          notFoundContent={isSearching ? <Spin indicator={<LoadingOutlined spin />} /> : null}
          filterOption={(inputValue, option) =>
            option.value.toLowerCase().includes(inputValue.toLowerCase())
          }
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={() => handleSearch(orderId)}
          loading={isSearching}
          block
        >
          Find order
        </Button>
      </div>

      {/* Список заказов */}
      {order.orders.length === 0 ? (
        <p>You have no orders yet</p>
      ) : (
        <div className={styles.ordersList}>
          {order.orders.map((order) => (
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
                    <Button onClick={() => navigate(`${SELLER_INFO_ROUTE}/${order.seller.id}`)}>
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
