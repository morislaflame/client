import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { Button, Spin } from 'antd';
import SellerModels from '../../components/SellerComponents/SellerModels';
import CreateSellerModel from '../../components/SellerComponents/modals/CreateSellerModel'; // Импортируем модальное окно
import styles from './SellerAccount.module.css';

const SellerAccount = observer(() => {
  const { user } = useContext(Context);
  const [showCreateModal, setShowCreateModal] = useState(false);


  return (
    <div className={styles.sellerAccount}>
      <div className={styles.header}>
        <h2>Seller Dashboard</h2>
        <Button type="primary" onClick={() => setShowCreateModal(true)}>
          Add New Model
        </Button>
      </div>
      <SellerModels />
      <CreateSellerModel show={showCreateModal} onHide={() => setShowCreateModal(false)} />
    </div>
  );
});

export default SellerAccount;
