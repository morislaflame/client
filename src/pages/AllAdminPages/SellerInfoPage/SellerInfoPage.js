import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../../../index';
import { observer } from 'mobx-react-lite';
import { Card, Button, message, Modal, Spin } from 'antd';
import styles from './SellerInfoPage.module.css';
import TopicBack from '../../../components/FuctionalComponents/TopicBack/TopicBack';
import StarRating from '../../../components/UI/StarRating/StarRating';
import LoadingIndicator from '../../../components/UI/LoadingIndicator/LoadingIndicator';

const SellerInfoPage = observer(() => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { admin, seller: sellerStore } = useContext(Context);
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAllReviews, setShowAllReviews] = useState(false);

    useEffect(() => {
        loadSellerInfo();
        sellerStore.loadSellerReviews(id);
    }, [id]);

    const loadSellerInfo = async () => {
        try {
            const data = await admin.getSellerById(id);
            setSeller(data);
        } catch (error) {
            message.error('Error loading seller info');
            console.error('Error loading seller:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async () => {
        Modal.confirm({
            title: 'Confirmation',
            content: 'Are you sure you want to remove the seller status? All his products will be deleted.',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await admin.changeUserRole(id, 'USER');
                    message.success('Seller status successfully removed');
                    navigate('/admin/sellers');
                } catch (error) {
                    message.error('Error changing user role');
                    console.error('Error changing user role:', error);
                }
            }
        });
    };

    const toggleShowAllReviews = () => {
        setShowAllReviews(!showAllReviews);
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    if (!seller) {
        return <Card><h2>Seller not found</h2></Card>;
    }

    return (
        <div className="container">
            <TopicBack title="Seller profile" />
            
                <div className={styles.seller_info}>
                    <div className={styles.seller_info_item}>
                        <div className={styles.seller_mail_id}>
                            {seller.email && (
                                <h4>{seller.email}</h4> 
                            )}
                            {seller.username && (
                                <h4>@{seller.username}</h4>
                            )}
                            {seller.telegramId && (
                                <h4>Telegram ID: {seller.telegramId}</h4>
                            )}
                            <h4>ID: {seller.id}</h4>
                        </div>
                        <div className={styles.seller_rating}>
                            <span>{seller.sellerInformation?.sellerRating.toFixed(1) || 0}</span>
                            <StarRating rating={seller.sellerInformation?.sellerRating.toFixed(1) || 0} readonly />
                        </div>
                    </div>
                    
                    {seller.sellerInformation?.sellerName && (
                        <span>Shop name: <strong>{seller.sellerInformation.sellerName}</strong></span>
                    )}
                    
                    {seller.sellerInformation?.sellerInfo && (
                        <span>Shop info: <strong>{seller.sellerInformation.sellerInfo}</strong></span>
                    )}
                </div>

                {sellerStore.sellerReviewsLoading ? (
                    <Spin tip="Loading reviews..." />
                ) : (
                    sellerStore.sellerReviews.length > 0 && (
                        <>
                            <h3>Reviews</h3>
                            <div className={styles.reviews}>
                                {sellerStore.sellerReviews
                                    .slice(0, showAllReviews ? sellerStore.sellerReviews.length : 5)
                                    .map(review => (
                                        <div key={review.id} className={styles.review}>
                                            <div className={styles.review_user}>
                                                <strong>{review.user.username || review.user.email || 'Аноним'}</strong>
                                                <StarRating rating={review.rating} readonly />
                                            </div>
                                            <div className={styles.review_comment}>
                                                {review.text}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            {sellerStore.sellerReviews.length > 5 && (
                                <Button onClick={toggleShowAllReviews}>
                                    {showAllReviews ? 'Hide' : 'Show all'}
                                </Button>
                            )}
                        </>
                    )
                )}
        </div>
    );
});

export default SellerInfoPage;
