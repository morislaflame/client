import React from 'react';
import PlaceholderImage from '../../../icons/placeholder.jpg';
import styles from './Placeholder.module.css';

const Placeholder = ({ className }) => {
    return (
        <img 
            src={PlaceholderImage} 
            alt="Placeholder" 
            className={`${styles.placeholder} ${className || ''}`}
        />
    );
};

export default Placeholder;
