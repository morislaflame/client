import React from 'react';
import styles from './OrderComponents.module.css';

const OrderModel = ({ modelProduct }) => {
  return (
    <div className='container-card'>
      
      {modelProduct.images && modelProduct.images[0] && (
        <img 
          src={process.env.REACT_APP_API_URL + modelProduct.images[0].img}
          alt={modelProduct.name}
          className={styles.productImage}
        />
      )}
      <p>Model Name: {modelProduct.name}</p>
      <p>Price: ${modelProduct.priceUSD}</p>
    </div>
  );
};

export default OrderModel;
