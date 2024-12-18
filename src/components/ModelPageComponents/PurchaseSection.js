import React from 'react';
import { Button, Spin } from 'antd';
import { LoadingOutlined } from "@ant-design/icons";
import { IoMdHeart, IoMdLock } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { TERMS_ROUTE } from '../../utils/consts';
import styles from './ModelPage.module.css';

const PurchaseSection = ({ 
  priceUSD, 
  isInBasket, 
  addingToBasket, 
  heartRef,
  onCreateOrder, 
  onAddToFavorites 
}) => {
  const navigate = useNavigate();

  return (
    <div className={styles.price_n_buy}>
      <div className={styles.inside}>
        <span className={styles.price}>${priceUSD}</span>
        <div className={styles.add_to_card}>
          <button
            className={styles.buy}
            onClick={onCreateOrder}
            disabled={addingToBasket}
          >
            {addingToBasket ? (
              <Spin indicator={<LoadingOutlined style={{color: 'white'}} spin />}/>
            ) : (
              'Create Order'
            )}
          </button>
          <Button
            className={styles.shopping_card}
            type='text'
            onClick={onAddToFavorites}
            style={{ height: '100%', padding: '0 var(--main-padding)',background: 'none' }}
          >
            <div ref={heartRef}>
              <IoMdHeart 
                style={{
                  color: isInBasket ? '#ff0000' : 'var(--color-text)', 
                  fontSize: 'calc(var(--index) * 3.5)'
                }}
              />
            </div>
          </Button>
        </div>
      </div>
      <div className={styles.warranty} onClick={() => navigate(TERMS_ROUTE)}>
        <span>14-days warranty</span> <IoMdLock className={styles.btn_icn}/>
      </div>
    </div>
  );
};

export default PurchaseSection;