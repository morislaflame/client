import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useContext, useLayoutEffect } from 'react';
import { Context } from '../../../index';
import { Button } from 'antd';
import SellerReviewItem from '../../SellerComponents/SellerReviewItem';
import ReviewsSkeletons from '../../UI/Skeletons/ReviewsSkeletons';
import AddSellerReview from '../../FuctionalComponents/modals/AddSellerReview/AddSellerReview';
import { UpAnimation } from '../../Animations/UpAnimation';
import { DownAnimation } from '../../Animations/DownAnimation';

const SellerReviewsInfo = observer(({ sellerId }) => {
    const { seller } = useContext(Context);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadReviews = async () => {
            setLoading(true);
            try {
                await seller.loadSellerReviews(sellerId);
            } catch (error) {
                console.error('Error loading seller reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        loadReviews();
    }, [sellerId]);

    useLayoutEffect(() => {
        DownAnimation('#seller-reviews-title');
        UpAnimation('#seller-reviews');
    }, []);

    const toggleShowAllReviews = () => {
        setShowAllReviews(!showAllReviews);
    };

    const handleAddReview = () => {
        setIsModalVisible(true);
    };

    return (
        <div className="container-item">
            <div 
                style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--main-gap)', 
                    width: '100%'
                }}
            >
                <h3 id='seller-reviews-title'>Reviews</h3> 
                <Button type="primary" onClick={handleAddReview}>Add Review</Button>
            </div>
            <div className="container-item" id='seller-reviews'>
                {loading ? (
                    <ReviewsSkeletons count={5} />
                ) : seller.sellerReviews.length > 0 ? (
                    <>
                        {seller.sellerReviews
                            .slice(0, showAllReviews ? seller.sellerReviews.length : 5)
                            .map(review => (
                                <SellerReviewItem key={review.id} review={review} />
                            ))}
                        {seller.sellerReviews.length > 5 && (
                            <Button onClick={toggleShowAllReviews}>
                                {showAllReviews ? 'Hide' : 'Show all reviews'}
                            </Button>
                        )}
                    </>
                ) : (
                    <div className="no-info-container">No reviews yet</div>
                )}
            </div>
            <AddSellerReview
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                sellerId={sellerId}
            />
        </div>
    );
});

export default SellerReviewsInfo;
