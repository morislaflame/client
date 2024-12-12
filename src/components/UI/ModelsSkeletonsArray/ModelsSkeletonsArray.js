import React from 'react';
import { Skeleton } from 'antd';

const ModelsSkeletonsArray = ({ count = 20 }) => {
    return (
        Array.from({ length: count }).map((_, index) => (
            <div key={index} className="thing-item-skeleton">
                <div className="skeleton-image">
                    <Skeleton.Image 
                        style={{ 
                            width: '100%', 
                            height: '250px', 
                            borderRadius: 'calc(var(--index)* 1)' 
                        }} 
                        active 
                    />
                    <Skeleton active paragraph={{ rows: 1, width: '80%' }} />
                </div>
            </div>
        ))
    );
};

export default ModelsSkeletonsArray;
