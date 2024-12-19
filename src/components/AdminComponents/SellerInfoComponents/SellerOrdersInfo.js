import React, { useEffect, useState, useLayoutEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../../../index';
import OrderCard from '../../OrderComponents/OrderCard/OrderCard';
import Search from '../../FuctionalComponents/Search/Search';
import OrdersSkeletons from '../../UI/Skeletons/OrdersSkeletons';
import { UpAnimation } from '../../Animations/UpAnimation';
import { DownAnimation } from '../../Animations/DownAnimation';


const SellerOrdersInfo = observer(({ sellerId }) => {
    const { order } = useContext(Context);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            setLoading(true);
            try {
                await order.getUserOrders(sellerId);
            } catch (error) {
                console.error('Error loading seller orders:', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadOrders();
    }, [sellerId]);

    useLayoutEffect(() => {
        UpAnimation('#seller-orders');
        DownAnimation('#seller-orders-title');
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
        <div className="container-item" >
            <h3 id='seller-orders-title'>Seller Orders</h3>
            <Search 
                data={order.userOrders}
                setFilteredData={setFilteredOrders}
                searchFields={['id', 'modelProduct.name']}
                placeholder="Search by order ID or model name"
                formatOption={formatOrderOption}
            />
            <div className="container-item" id='seller-orders'>
                {loading ? (
                    <OrdersSkeletons count={10} />
                ) : (
                    filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))
                    ) : (
                        <span className="no-info-container">
                            {order.userOrders.length > 0 ? 'No orders found' : 'No orders'}
                        </span>
                    )
                )}
            </div>
        </div>
    );
});

export default SellerOrdersInfo;
