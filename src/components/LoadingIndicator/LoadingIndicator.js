import React from 'react';
import styles from './LoadingIndicator.module.css';


const LoadingIndicator = () => {
  return (
    <div className={styles.loading_indicator}>
      <p>Loading content, please wait...</p>
      <img src={require('../../icons/skelet.gif')} className={styles.loading_indicator_img} alt="Loading" />
    </div>
  );
};

export default LoadingIndicator;