import React from 'react';
import { Skeleton } from 'antd';

const OrdersSkeletons = ({ count = 10 }) => {
    return (
        Array.from({ length: count }).map((_, index) => (
            <div key={index} className="order-card-skeleton">
                <div className="skeleton-content">
                    <Skeleton.Image 
                        active 
                        style={{ 
                            width: '30%',
                            height: 'calc(var(--index) * 10)',
                            borderRadius: 'var(--small-border-radius)'
                        }} 
                    />
                    <Skeleton 
                        active 
                        paragraph={{ rows: 3, width: ['60%', '40%', '80%'] }}
                        title={false}
                    />
                </div>
            </div>
        ))
    );
};

export default OrdersSkeletons;