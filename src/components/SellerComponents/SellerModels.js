import React, { useEffect, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import SellerThingItem from './SellerThingItem';
import { message, Spin } from 'antd';
import styles from './SellerComponents.module.css';
import { useNavigate } from 'react-router-dom';

const SellerModels = observer(() => {
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

  const handleDelete = async (thing) => {
    try {
      await seller.deleteProduct(thing.id);
      message.success('Model deleted successfully');
    } catch (error) {
      message.error('Error deleting model');
    }
  };

  const { myModelProducts } = seller;

  return (
    <div className={styles.seller_thing_list}>
      {loading ? (
        <Spin />
      ) : myModelProducts && myModelProducts.length > 0 ? (
        myModelProducts.map((thing) => (
          <SellerThingItem
            key={thing.id}
            thing={thing}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <span className={styles.placeholder}>You don't have any Models.</span>
      )}
    </div>
  );
});

export default SellerModels;
