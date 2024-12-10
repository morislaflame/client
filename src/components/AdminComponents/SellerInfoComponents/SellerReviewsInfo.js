import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../../../index';
import { Button, Spin } from 'antd';
import StarRating from '../../../components/UI/StarRating/StarRating';
import styles from './SellerInfoComponents.module.css';

const SellerReviewsInfo = observer(() => {
    const { seller } = useContext(Context);
    const [showAllReviews, setShowAllReviews] = useState(false);

    const toggleShowAllReviews = () => {
        setShowAllReviews(!showAllReviews);
    };

    return (
        <div className={styles.reviews}>
            <h3>Reviews</h3>
            {seller.sellerReviewsLoading ? (
                <Spin tip="Loading reviews..." />
            ) : (
                seller.sellerReviews.length > 0 ? (
                    <>
                        <div className={styles.reviews}>
                            {seller.sellerReviews
                                .slice(0, showAllReviews ? seller.sellerReviews.length : 5)
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
                        {seller.sellerReviews.length > 5 && (
                            <div className={styles.show_more_button}>
                                <Button onClick={toggleShowAllReviews}>
                                    {showAllReviews ? 'Hide' : 'Show all reviews'}
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className={styles.no_reviews}>No reviews yet</div>
                )
            )}
        </div>
    );
});

export default SellerReviewsInfo;
