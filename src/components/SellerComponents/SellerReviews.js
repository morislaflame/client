import React from 'react';
import StarRating from '../UI/StarRating/StarRating';
import styles from './SellerComponents.module.css';

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
            {reviews.map(review => (
                <div key={review.id} className={styles.review_item}>
                    <div className={styles.review_header}>
                        <div className={styles.user_info}>
                            <span className={styles.username}>
                                {review.user.email || `@${review.user.username}` || `Telegram ID: ${review.user.telegramId}`}
                            </span>
                            <span className={styles.date}>
                                {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <StarRating rating={review.rating} readonly />
                    </div>
                    <p className={styles.review_text}>{review.text}</p>
                </div>
            ))}
        </div>
    );
};

export default SellerReviews;
