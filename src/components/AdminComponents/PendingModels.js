// components/AdminComponents/PendingModels.js

import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import PendingModelItem from './PendingModelItem';
import styles from './AdminComponents.module.css';

const PendingModels = observer(() => {
  const { admin } = useContext(Context);

  useEffect(() => {
    admin.loadPendingModelProducts();
  }, [admin]);

  const { pendingModelProducts, isLoadingPendingModels } = admin;

  const handleApprove = async (modelId) => {
    await admin.approveModelProduct(modelId);
  };

  const handleReject = async (modelId, rejectionReason) => {
    await admin.rejectModelProduct(modelId, rejectionReason);
  };

  return (
    <div className={styles.pending_models}>
      <h3>Pending Models</h3>
      {isLoadingPendingModels ? (
        <div>Loading...</div>
      ) : pendingModelProducts && pendingModelProducts.length > 0 ? (
        pendingModelProducts.map((model) => (
          <PendingModelItem
            key={model.id}
            model={model}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))
      ) : (
        <p>No pending models.</p>
      )}
    </div>
  );
});

export default PendingModels;
