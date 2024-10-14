import React from 'react';
import styles from './LoadingIndicator.module.css';


const LoadingIndicator = () => {
  return (
    <div className={styles.loading_indicator}>
      <p>Loading content, please wait...</p>
      <img src={require('../../icons/skelet.gif')} alt="Loading" />
    </div>
  );
};

export default LoadingIndicator;