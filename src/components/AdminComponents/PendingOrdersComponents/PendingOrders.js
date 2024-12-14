import React from 'react'
import { observer } from 'mobx-react-lite'; 
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ALL_ORDERS_ROUTE } from '../../../utils/consts';
import styles from '../AdminComponents.module.css';

const PendingOrders = observer(() => {
  const navigate = useNavigate();

  return (
    <div className={styles.search_section}>
        <h3>All Orders</h3>
        <Button
            type="primary"
            onClick={() => navigate(ALL_ORDERS_ROUTE)}
        >
            View All
        </Button>
    </div>
  )
});

export default PendingOrders