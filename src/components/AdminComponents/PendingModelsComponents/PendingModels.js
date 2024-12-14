// components/AdminComponents/PendingModels.js

import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../index';
import { Button, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ALL_PENDING_MODELS_ROUTE } from '../../../utils/consts';
import styles from '../AdminComponents.module.css';

const PendingModels = observer(() => {
  const { admin } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPendingModels = async () => {
      try {
        await admin.loadPendingModelProducts();
      } catch (error) {
        console.error('Error loading pending models count:', error);
      }
    };

    loadPendingModels();
  }, [admin]);

  return (
    <div className="container-item">
        <div className={styles.search_section}>
        <h3>Pending Models</h3>
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--main-gap)' }}>
            <h5>{admin.pendingModelProducts.length} models waiting for approval</h5>
            {admin.pendingModelProducts.length > 0 && (
              <Tag color="red">
                {admin.pendingModelProducts.length}
              </Tag>
            )}
          </span>
          {admin.pendingModelProducts.length > 0 && (
            <Button 
              type="primary"
              onClick={() => navigate(ALL_PENDING_MODELS_ROUTE)}
            className={styles.view_all_button}
            >
              View All Pending Models
            </Button>
          )}
        </div>
    </div>
  );
});

export default PendingModels;
