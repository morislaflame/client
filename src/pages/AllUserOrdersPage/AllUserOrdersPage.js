import React, { useEffect, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import TopicBack from '../../components/FuctionalComponents/TopicBack/TopicBack';
import Search from '../../components/UI/Search/Search';
import OrderCard from '../../components/OrderComponents/OrderCard/OrderCard';
import OrdersSkeletons from '../../components/UI/Skeletons/OrdersSkeletons';

const AllUserOrdersPage = observer(() => {
    const { order } = useContext(Context);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            setLoading(true);
            try {
                await order.loadMyOrders();
            } catch (error) {
                console.error('Error loading orders:', error);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    const formatOrderOption = (order) => ({
        value: order.id.toString(),
        label: (
            <div className="search_options">
                <span className="search_options_label">Order #: {order.id}</span>
                <span className="search_options_label">Model: {order.modelProduct?.name}</span>
                <span className="search_options_label">Price: ${order.totalPriceUSD}</span>
            </div>
        )
    });

    return (
        <div className="container">
            <TopicBack title="My Orders" />
            <div className="container-item">
                <Search 
                    data={order.orders}
                    setFilteredData={setFilteredOrders}
                    searchFields={['id', 'modelProduct.name']}
                    placeholder="Enter order number"
                    formatOption={formatOrderOption}
                />
                <div className="container-item">
                    {loading ? (
                        <OrdersSkeletons count={10} />
                    ) : filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))
                    ) : (
                        <span className="no-info-container">
                            {order.orders.length > 0 ? 'No orders found' : 'You have no orders yet'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
});

export default AllUserOrdersPage;
