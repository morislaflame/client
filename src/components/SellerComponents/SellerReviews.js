import React from 'react';
import styles from './SellerComponents.module.css';
import SellerReviewItem from './SellerReviewItem';

const SellerReviews = ({ reviews }) => {
    if (!reviews || reviews.length === 0) {
        return (
            <div className={styles.no_reviews}>
                <p>No reviews yet</p>
            </div>
        );
    }

    return (
        <div className={styles.reviews_container}>
            <h3>My Reviews</h3>
            {reviews.map(review => (
                <SellerReviewItem key={review.id} review={review} />
            ))}
        </div>
    );
};

export default SellerReviews;
