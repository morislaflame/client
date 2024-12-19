import React, { useEffect, useContext, useState, useLayoutEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import SellerModelItem from './SellerModelItem';
import { message } from 'antd';
import styles from './SellerComponents.module.css';
import { useNavigate } from 'react-router-dom';
import ModelsSkeletonsArray from '../UI/Skeletons/ModelsSkeletonsArray';
import { UpAnimation } from '../Animations/UpAnimation';

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

  useLayoutEffect(() => {
    UpAnimation('#models');
  }, []);

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
    <div className={styles.models} id='models'>
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
            <SellerModelItem
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
