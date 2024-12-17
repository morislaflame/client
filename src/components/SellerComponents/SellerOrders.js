import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import OrderCard from '../OrderComponents/OrderCard/OrderCard';
import OrdersSkeletons from '../UI/Skeletons/OrdersSkeletons';
import Search from '../FuctionalComponents/Search/Search';

const SellerOrders = observer(() => {
    const { seller } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        const loadMyOrders = async () => {
            setLoading(true);
            try {
                await seller.loadMyOrders();
            } catch (error) {
                console.error('Error loading seller orders:', error);
            } finally {
                setLoading(false);
            }
        };
        loadMyOrders();
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
        <div className="container-item">
            <h3>My Orders</h3>
            <Search 
                data={seller.myOrders}
                setFilteredData={setFilteredOrders}
                searchFields={['id', 'modelProduct.name']}
                placeholder="Search by order ID or model name"
                formatOption={formatOrderOption}
            />
            <div className="container-item">
                {loading ? (
                    <OrdersSkeletons count={10} />
                ) : (
                    filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => 
                            <OrderCard key={order.id} order={order} />
                        ) 
                    ) : (
                        <span className="no-info-container">
                            {seller.myOrders.length > 0 ? 'No orders found' : 'No orders'}
                        </span>
                    )
                )}
            </div>
        </div>
    );
});

export default SellerOrders;