import React from 'react';
import StarRating from '../UI/StarRating/StarRating';
import styles from './SellerComponents.module.css';
import FormatDate from '../UI/FormatDate/FormatDate';

const SellerReviewItem = ({ review }) => {
    return (
        <div className={styles.review}>
            <div className={styles.review_user}>
                <strong>{review.user?.username || review.user?.email || 'Аноним'}</strong>
                <StarRating rating={review.rating} readonly />
            </div>
            <div className={styles.review_comment}>
                {review.text}
            </div>
            <div className={styles.review_date}>
                <FormatDate date={review.createdAt} />
            </div>
        </div>
    );
};

export default SellerReviewItem;
