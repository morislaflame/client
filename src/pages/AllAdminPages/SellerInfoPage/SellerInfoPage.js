import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../../../index';
import { observer } from 'mobx-react-lite';
import { Card, message } from 'antd';
import styles from './SellerInfoPage.module.css';
import TopicBack from '../../../components/FuctionalComponents/TopicBack/TopicBack';
import StarRating from '../../../components/UI/StarRating/StarRating';
import LoadingIndicator from '../../../components/UI/LoadingIndicator/LoadingIndicator';
import SellerModelsInfo from '../../../components/AdminComponents/SellerInfoComponents/SellerModelsInfo';
import SellerOrdersInfo from '../../../components/AdminComponents/SellerInfoComponents/SellerOrdersInfo';
import SellerReviewsInfo from '../../../components/AdminComponents/SellerInfoComponents/SellerReviewsInfo';

const SellerInfoPage = observer(() => {
    const { id } = useParams();
    const { seller } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('models');

    useEffect(() => {
        loadSellerInfo();
        seller.loadSellerReviews(id);
    }, [id]);

    const loadSellerInfo = async () => {
        try {
            await seller.getSellerById(id);
        } catch (error) {
            message.error('Error loading seller info');
            console.error('Error loading seller:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    if (!seller.sellerInfo) {
        return <Card><h2>Seller not found</h2></Card>;
    }

    return (
        <div className="container">
            <TopicBack title="Seller profile" />

            <div className={styles.seller_info}>
                <div className={styles.seller_info_item}>
                    <div className={styles.seller_mail_id}>
                        {seller.sellerInfo.email && (
                            <h4>{seller.sellerInfo.email}</h4> 
                        )}
                        {seller.sellerInfo.username && (
                            <h4>@{seller.sellerInfo.username}</h4>
                        )}
                        {seller.sellerInfo.telegramId && (
                            <h4>Telegram ID: {seller.sellerInfo.telegramId}</h4>
                        )}
                        <h4>ID: {seller.sellerInfo.id}</h4>
                    </div>
                    <div className={styles.seller_rating}>
                        <span>{seller.sellerInfo.sellerInformation?.sellerRating.toFixed(1) || 0}</span>
                        <StarRating rating={seller.sellerInfo.sellerInformation?.sellerRating.toFixed(1) || 0} readonly />
                    </div>
                </div>
                
                {seller.sellerInfo.sellerInformation?.sellerName && (
                    <span>Shop name: <strong>{seller.sellerInfo.sellerInformation.sellerName}</strong></span>
                )}
                
                {seller.sellerInfo.sellerInformation?.sellerInfo && (
                        <span>Shop info: <strong>{seller.sellerInfo.sellerInformation.sellerInfo}</strong></span>
                )}

                <div className={styles.menu_links}>
                    <button className={styles.menu_link} onClick={() => setSelectedTab('models')}>
                        Models
                    </button>
                    <button className={styles.menu_link} onClick={() => setSelectedTab('orders')}>
                        Orders
                    </button>
                    <button className={styles.menu_link} onClick={() => setSelectedTab('reviews')}>
                        Reviews
                    </button>
                </div>
            </div>

            {selectedTab === 'models' && (
                <SellerModelsInfo sellerId={id} />
            )}

            {selectedTab === 'orders' && (
                <SellerOrdersInfo />
            )}

            {selectedTab === 'reviews' && (
                <SellerReviewsInfo />
            )}
        </div>
    );
});

export default SellerInfoPage;
