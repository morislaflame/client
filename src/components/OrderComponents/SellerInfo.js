// client/src/components/OrderComponents/SellerInfo.js
import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SELLER_INFO_ROUTE } from '../../utils/consts';
import styles from './OrderComponents.module.css';

const SellerInfo = ({ seller }) => {
  const navigate = useNavigate();

  return (
    <div className='container-item'>
        <div className='container-card'>
            <div className={styles.orderSeller}>
                <span>Seller: {seller?.sellerInformation?.sellerName}</span>
                <Button 
                    type="ghost"
                    onClick={() => navigate(`${SELLER_INFO_ROUTE}/${seller.id}`)}
                >
                    View profile
                </Button>
            </div>
        </div>
    </div>
  );
};

export default SellerInfo;