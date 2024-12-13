import React from 'react';
import { Skeleton } from 'antd';

const ReviewsSkeletons = ({ count = 10 }) => {
    return (
        Array.from({ length: count }).map((_, index) => (
            <div key={index} className="order-card-skeleton">
                <div className="skeleton-content">
                    <Skeleton 
                        active 
                        paragraph={{ rows: 4, width: ['60%', '40%', '80%'] }}
                        title={false}
                    />
                </div>
            </div>
        ))
    );
};

export default ReviewsSkeletons;