import React, { useEffect, useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import SellerReviewItem from './SellerReviewItem';
import ReviewsSkeletons from '../UI/Skeletons/ReviewsSkeletons';

const SellerReviews = observer(() => {
    const { seller } = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadReviews = async () => {
            setLoading(true);
            try {
                await seller.loadSellerReviews(seller.sellerInfo.id);
            } catch (error) {
                console.error('Error loading seller reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        loadReviews();
    }, []);

    return (
        <div className="container-item">
            <h3>My Reviews</h3>
            <div className="container-item">
                {loading ? (
                    <ReviewsSkeletons count={5} />
                ) : seller.sellerReviews.length > 0 ? (
                    seller.sellerReviews.map(review => (
                        <SellerReviewItem key={review.id} review={review} />
                    ))
                ) : (
                    <span className="no-info-container">No reviews yet</span>
                )}
            </div>
        </div>
    );
});

export default SellerReviews;