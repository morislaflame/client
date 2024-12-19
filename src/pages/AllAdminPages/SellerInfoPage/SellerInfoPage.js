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
import { GiHighHeel } from 'react-icons/gi';
import { LuClipboardList } from 'react-icons/lu';
import { LuMessageSquare } from "react-icons/lu";
import SellerProfile from '../../../components/AdminComponents/SellerInfoComponents/SellerProfile';

const SellerInfoPage = observer(() => {
    const { id } = useParams();
    const { seller, user } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('models');

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        loadSellerInfo();
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

    const isAdmin = user.isAuth && user.user.role === 'ADMIN';

    if (loading) {
        return <LoadingIndicator />;
    }

    if (!seller.sellerInfo) {
        return <Card><h2>Seller not found</h2></Card>;
    }

    return (
        <div className="container">
            <TopicBack title="Seller profile" />
            <div className="container-item" >
                <SellerProfile sellerInfo={seller.sellerInfo} />

                <div className={styles.menu_links}>
                    <button className={styles.menu_link} onClick={() => setSelectedTab('models')}>
                        <GiHighHeel />Models
                    </button>
                    {isAdmin && (    
                        <button className={styles.menu_link} onClick={() => setSelectedTab('orders')}>
                            <LuClipboardList />Orders
                        </button>
                    )}
                    <button className={styles.menu_link} onClick={() => setSelectedTab('reviews')}>
                        <LuMessageSquare />Reviews
                    </button>
                </div>
            </div>
            {selectedTab === 'models' && (
                <SellerModelsInfo sellerId={id} />
            )}

            {isAdmin && selectedTab === 'orders' && (
                <SellerOrdersInfo sellerId={id} />
            )}
            
            {selectedTab === 'reviews' && (
                <SellerReviewsInfo sellerId={id} />
            )}
        </div>
    );
});

export default SellerInfoPage;
