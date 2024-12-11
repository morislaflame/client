import React, { useContext } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../../index';
import { ORDER_ROUTE, SELLER_INFO_ROUTE } from '../../../utils/consts';
import styles from './OrderCard.module.css';
import OrderTags from '../../UI/OrderTags/OrderTags';
import FormatDate from '../../UI/FormatDate/FormatDate';

const OrderCard = ({ order }) => {
    const navigate = useNavigate();
    const { user } = useContext(Context);

    const isAdmin = user.user?.role === 'ADMIN';
    const isSeller = user.user?.id === order.sellerId;
    const isBuyer = user.user?.id === order.buyerId;

    const renderUserInfo = () => {
        if (isAdmin) {
            return (
                <>
                    <div className={styles.orderParticipant}>
                        <span>Seller: {order.seller.sellerInformation?.sellerName || order.seller.email}</span>
                        <span>Buyer: {order.buyer.email || `@${order.buyer.username}` || `ID: ${order.buyer.telegramId}`}</span>
                    </div>
                </>
            );
        }

        if (isSeller) {
            return (
                <span>Buyer: {order.buyer.email || `@${order.buyer.username}` || `ID: ${order.buyer.telegramId}`}</span>
            );
        }

        if (isBuyer) {
            return (
                <span>Seller: {order.seller.sellerInformation?.sellerName || order.seller.email}</span>
            );
        }

        return null;
    };

    return (
        <div className={styles.orderCard}>
            <div className={styles.orderInfo}>
                <div className={styles.orderId}>
                    <h3>Order #{order.id}</h3>
                    <OrderTags status={order.status} />
                </div>
                <div className={styles.orderTotal}>
                    <p>Total: ${order.totalPriceUSD}</p>
                    <p><FormatDate date={order.createdAt} /></p>
                </div>
                <div className={styles.orderSeller}>
                    {renderUserInfo()}
                    <Button 
                        type="ghost"
                        onClick={() => navigate(`${SELLER_INFO_ROUTE}/${order.sellerId}`)}
                    >
                        Go to chat
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
    );
};

export default OrderCard;
