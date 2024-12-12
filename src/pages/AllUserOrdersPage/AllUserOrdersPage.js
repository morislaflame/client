import React, { useEffect, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import TopicBack from '../../components/FuctionalComponents/TopicBack/TopicBack';
import Search from '../../components/UI/Search/Search';
import OrderCard from '../../components/OrderComponents/OrderCard/OrderCard';

const AllUserOrdersPage = observer(() => {
    const { order } = useContext(Context);
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        order.loadMyOrders();
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
                {filteredOrders.length === 0 ? (
                    <p>You have no orders yet</p>
                ) : (
                    <div className="container-item">
                        {filteredOrders.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});

export default AllUserOrdersPage;
