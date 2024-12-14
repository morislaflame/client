import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../../../index';
import { observer } from 'mobx-react-lite';
import OrderCard from '../../../components/OrderComponents/OrderCard/OrderCard';
import TopicBack from '../../../components/FuctionalComponents/TopicBack/TopicBack';
import Search from '../../../components/UI/Search/Search';
import OrdersSkeletons from '../../../components/UI/Skeletons/OrdersSkeletons';

const AllOrdersPage = observer(() => {
    const { order } = useContext(Context);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            setLoading(true);
            try {
                await order.loadAllOrders();
            } catch (error) {
                console.error('Error loading orders:', error);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [order]);

    const formatOrderOption = (order) => ({
        value: order.id.toString(),
        label: (
            <div className="search_options">
                <span className="search_options_label">Order #{order.id}</span>
                <span className="search_options_label">
                    {order.seller?.sellerInformation?.sellerName || order.seller?.email} - ${order.totalPriceUSD}
                </span>
            </div>
        )
    });

    return (
        <div className="container">
            <TopicBack title="All Orders" />
            <div className="container-item">
                <Search 
                    data={order.orders}
                    setFilteredData={setFilteredOrders}
                    searchFields={['id', 'totalPriceUSD', 'seller.email', 'seller.sellerInformation.sellerName', 'buyer.email']}
                    placeholder="Search by order ID, price, seller or buyer"
                    formatOption={formatOrderOption}
                />

                <div className="container-item">
                    {loading ? (
                        <OrdersSkeletons count={10} />
                    ) : filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <OrderCard 
                                key={order.id} 
                                order={order}
                            />
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

export default AllOrdersPage;
