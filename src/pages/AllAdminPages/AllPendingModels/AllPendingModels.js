import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../index';
import PendingModelItem from '../../../components/AdminComponents/PendingModelsComponents/PendingModelItem';
import Search from '../../../components/UI/Search/Search';
import ModelsSkeletonsArray from '../../../components/UI/Skeletons/ModelsSkeletonsArray';
import TopicBack from '../../../components/FuctionalComponents/TopicBack/TopicBack';

const AllPendingModels = observer(() => {
  const { admin } = useContext(Context);
  const [filteredModels, setFilteredModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPendingModels = async () => {
      setLoading(true);
      try {
        await admin.loadPendingModelProducts();
      } catch (error) {
        console.error('Error loading pending models:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPendingModels();
  }, [admin]);

  const handleApprove = async (modelId) => {
    try {
      setLoading(true);
      await admin.approveModelProduct(modelId);
    } catch (error) {
      console.error('Error approving model:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (modelId, rejectionReason) => {
    try {
      setLoading(true);
      await admin.rejectModelProduct(modelId, rejectionReason);
    } catch (error) {
      console.error('Error rejecting model:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatModelOption = (model) => ({
    value: model.id.toString(),
    label: (
      <div className="search_options">
        <span className="search_options_label">{model.name} (ID: {model.id})</span>
        <span className="search_options_label">Price: ${model.priceUSD}</span>
      </div>
    )
  });

  return (
    <div className="container">
      <TopicBack title="Pending Models" />
      <div className="container-item">
        <Search 
          data={admin.pendingModelProducts}
          setFilteredData={setFilteredModels}
          searchFields={['id', 'name', 'priceUSD']}
          placeholder="Search by model name or ID"
          formatOption={formatModelOption}
        />
        <div className="thing-list">
          {loading ? (
            <ModelsSkeletonsArray count={20} />
          ) : (
            filteredModels.length > 0 ? (
              filteredModels.map((model) => (
                <PendingModelItem
                  key={model.id}
                  model={model}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))
            ) : (
              <span className="no-info-container">No pending models found.</span>
            )
          )}
        </div>
      </div>
    </div>
  );
});

export default AllPendingModels;
