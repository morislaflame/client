import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import TopicBack from '../../components/FuctionalComponents/TopicBack/TopicBack';
import ModelsOfSeller from '../../components/UserComponents/ModelsOfSeller/ModelsOfSeller';
import StarRating from '../../components/UI/StarRating/StarRating';
import styles from './SellerProfile.module.css';

const SellerProfile = observer(() => {
    const { id } = useParams();
    const { seller } = useContext(Context);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const loadSellerData = async () => {
            await seller.getSellerById(id);
            await seller.loadSellerReviews(id);
        };
        loadSellerData();
    }, [id]);

    const { sellerInfo } = seller;

    return (
        <div className={styles.sellerProfile}>
            <TopicBack title="Seller Profile" />
            
            <div className={styles.sellerProfile_info}>
            <div className={styles.shop_menu}>
                <div className={styles.shop_name_rating}>
                <div className={styles.shop_name}>
                    <h3>{sellerInfo.sellerInformation?.sellerName}</h3>
                    
                </div>
                <div className={styles.shop_rating}>
                    <StarRating rating={sellerInfo?.sellerInformation?.sellerRating || 0} readonly />
                </div>
                </div>
                <div className={styles.shop_info}>
                <h5>"{sellerInfo.sellerInformation?.sellerInfo}"</h5>
                </div>
            </div>
            </div>

            <ModelsOfSeller models={sellerInfo?.sellingProducts || []} />

            <div className="mt-4">
                <h3>Отзывы о продавце</h3>
                {seller.sellerReviews.map(review => (
                    <div key={review.id} className={styles.review}>
                        <div className={styles.review_body}>
                            <div className="d-flex justify-content-between">
                                <h5>{review.user.username}</h5>
                                <StarRating rating={review.rating} readonly />
                            </div>
                            <p>{review.text}</p>
                            <small className="text-muted">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default SellerProfile;

