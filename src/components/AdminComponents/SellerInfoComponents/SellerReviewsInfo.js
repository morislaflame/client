import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../../../index';
import { Button } from 'antd';
import SellerReviewItem from '../../SellerComponents/SellerReviewItem';
import LoadingIndicator from '../../UI/LoadingIndicator/LoadingIndicator';
import AddSellerReview from '../../FuctionalComponents/modals/AddSellerReview/AddSellerReview';

const SellerReviewsInfo = observer(({ sellerId }) => {
    const { seller } = useContext(Context);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        seller.loadSellerReviews(sellerId);
    }, [sellerId]);

    const toggleShowAllReviews = () => {
        setShowAllReviews(!showAllReviews);
    };

    const handleAddReview = () => {
        setIsModalVisible(true);
    };

    if (seller.sellerReviewsLoading) {
        return <LoadingIndicator />;
    }

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
                <h3>Reviews</h3> 
                <Button type="primary" onClick={handleAddReview}>Add Review</Button>
            </div>
                {seller.sellerReviews.length > 0 ? (
                    <>
                        <div className="container-item">
                            {seller.sellerReviews
                                .slice(0, showAllReviews ? seller.sellerReviews.length : 5)
                                .map(review => (
                                    <SellerReviewItem key={review.id} review={review} />
                                ))}
                        </div>
                        {seller.sellerReviews.length > 5 && (
                            <Button onClick={toggleShowAllReviews}>
                                {showAllReviews ? 'Hide' : 'Show all reviews'}
                            </Button>
                           
                        )}
                    </>
                ) : (
                    <div className="no-info-container">No reviews yet</div>
                )}
            <AddSellerReview
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                sellerId={sellerId}
            />
        </div>
    );
});

export default SellerReviewsInfo;
