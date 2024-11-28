import React from 'react';
import StarRating from '../../UI/StarRating/StarRating';
import styles from './ReviewsOfSeller.module.css';
import { observer } from 'mobx-react-lite';

const ReviewsOfSeller = observer(({ reviews }) => {
    return (
        <div className="mt-4">
            <h3>Отзывы о продавце</h3>
            {reviews.map(review => (
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
    );
});

export default ReviewsOfSeller;