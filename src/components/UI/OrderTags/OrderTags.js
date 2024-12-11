import React from 'react';
import { Tag } from 'antd';

export const getStatusColor = (status) => {
    switch (status) {
        case 'CREATED':
            return 'blue';
        case 'PAID':
            return 'orange';
        case 'COMPLETED':
            return 'green';
        case 'RETURN_PENDING':
            return 'orange';
        case 'RETURN_REJECTED':
            return 'red';
        case 'RETURN_APPROVED':
            return 'green';
        case 'CLOSED':
            return 'gray';
        default:
            return 'gray';
    }
};

const OrderTags = ({ status }) => {
    return (
        <Tag color={getStatusColor(status)}>
            {status}
        </Tag>
    );
};

export default OrderTags;
