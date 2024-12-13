import React, { useEffect, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import SellerThingItem from './SellerThingItem';
import { message } from 'antd';
import styles from './SellerComponents.module.css';
import { useNavigate } from 'react-router-dom';
import ModelsSkeletonsArray from '../UI/Skeletons/ModelsSkeletonsArray';

const SellerModels = observer(({ onAddModel }) => {
  const { seller } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMyModelProducts = async () => {
      setLoading(true);
      try {
        await seller.loadMyModelProducts();
      } catch (error) {
        console.error('Error loading seller models:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMyModelProducts();
  }, [seller]);

  const handleEdit = (thing) => {
    navigate(`/seller/edit-model/${thing.id}`);
  };

  const handleDelete = async (id) => {
    try {
      await seller.deleteProduct(id);
      message.success('Model deleted successfully');
    } catch (error) {
      message.error('Error deleting model');
    }
  };

  const { myModelProducts } = seller;

  return (
    <div className={styles.models}>
      <div className={styles.models_header}>
        <h3>My Models</h3> 
        <div className={styles.buttons}>
          <button className={styles.add_model_button} onClick={onAddModel}>
            Add Model
          </button>
        </div>
      </div>
      <div className="thing-list">
        {loading ? (
          <ModelsSkeletonsArray count={20} />
        ) : myModelProducts && myModelProducts.length > 0 ? (
          myModelProducts.map((thing) => (
            <SellerThingItem
              key={thing.id}
              thing={thing}
              onEdit={handleEdit}
              onDelete={() => handleDelete(thing.id)}
            />
          ))
        ) : (
          <div className="no-info-container">You don't have any Models.</div>
        )}
      </div>
    </div>
  );
});

export default SellerModels;
