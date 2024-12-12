import React, { useEffect, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import styles from './AllUserOrdersPage.module.css';
import TopicBack from '../../components/FuctionalComponents/TopicBack/TopicBack';
import { Space, Typography } from 'antd';
import Search from '../../components/UI/Search/Search';
import OrderCard from '../../components/OrderComponents/OrderCard/OrderCard';

const { Text } = Typography;

const AllUserOrdersPage = observer(() => {
    const { order } = useContext(Context);
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        order.loadMyOrders();
    }, []);

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
                setFilteredData={setFilteredOrders}
                searchFields={['id', 'modelProduct.name']}
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
