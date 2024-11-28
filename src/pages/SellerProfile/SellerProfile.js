import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import TopicBack from '../../components/FuctionalComponents/TopicBack/TopicBack';
import ModelsOfSeller from '../../components/UserComponents/ModelsOfSeller/ModelsOfSeller';
import StarRating from '../../components/UI/StarRating/StarRating';
import { FaComment } from "react-icons/fa";
import { IoWomanSharp } from "react-icons/io5";
import ReviewsOfSeller from '../../components/UserComponents/ReviewsOfSeller/ReviewsOfSeller';
import styles from './SellerProfile.module.css';
import AddSellerReview from '../../components/FuctionalComponents/modals/AddSellerReview/AddSellerReview';

const SellerProfile = observer(() => {
    const { id } = useParams();
    const { seller } = useContext(Context);
    const [selectedTab, setSelectedTab] = useState('models');
    const [showAddReviewModal, setShowAddReviewModal] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const loadSellerData = async () => {
            await seller.getSellerById(id);
            await seller.loadSellerReviews(id);
        };
        loadSellerData();
    }, [id, seller]);

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
                    <div className={styles.menu_info}>
                        <div className={styles.menu_links}>
                            <button 
                                className={styles.menu_link} 
                                onClick={() => setSelectedTab('models')}
                            >
                                <IoWomanSharp />Models
                            </button>
                            <button 
                            className={styles.menu_link} 
                                onClick={() => setSelectedTab('reviews')}
                            >
                                <FaComment /> Reviews
                            </button>
                        </div>
                        <button 
                            className={styles.menu_link} 
                            onClick={() => setShowAddReviewModal(true)}
                        >
                            <FaComment />Add Review
                        </button>
                    </div>
                </div>
            </div>

            {selectedTab === 'models' && (
                <ModelsOfSeller models={sellerInfo?.sellingProducts || []} />
            )}

            {selectedTab === 'reviews' && (
                <ReviewsOfSeller reviews={seller.sellerReviews} />
            )}
            <AddSellerReview
                visible={showAddReviewModal}
                onClose={() => setShowAddReviewModal(false)}
                sellerId={id}
            />
        </div>
        
    );
});

export default SellerProfile;

