import React from 'react';
import styles from './AdminComponents.module.css';

const AdminControls = ({ 
  setTypeVisible, 
  setBrandVisible, 
  setStoryVisible, 
  setPromoVisible, 
  setModelVisible 
}) => {
  return (
    <div className={styles.admin_buttons}>
      <button onClick={() => setTypeVisible(true)}>Добавить страну</button>
      <button onClick={() => setBrandVisible(true)}>Добавить бренд</button>
      <button onClick={() => setStoryVisible(true)}>Добавить историю</button>
      <button onClick={() => setPromoVisible(true)}>Добавить промокод</button>
      <button onClick={() => setModelVisible(true)}>Добавить модель</button>
    </div>
  );
};

export default AdminControls;
