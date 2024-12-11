import React from 'react';

export const formatDate = (dateString, detailed = false) => {
    if (detailed) {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    return new Date(dateString).toLocaleDateString();
};

const FormatDate = ({ date, detailed = false }) => {
    return <span>{formatDate(date, detailed)}</span>;
};

export default FormatDate;
