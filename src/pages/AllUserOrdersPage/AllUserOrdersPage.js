import React, { useEffect, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { useNavigate } from 'react-router-dom';
import styles from './AllUserOrdersPage.module.css';
import TopicBack from '../../components/FuctionalComponents/TopicBack/TopicBack';
import { Button, Space, Typography } from 'antd';
import Search from '../../components/UI/Search/Search';
import OrderTags from '../../components/UI/OrderTags/OrderTags';
import FormatDate from '../../components/UI/FormatDate/FormatDate';
import OrderCard from '../../components/OrderComponents/OrderCard/OrderCard';

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
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
});

export default AllUserOrdersPage;
