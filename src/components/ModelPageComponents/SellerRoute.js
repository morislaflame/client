import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SELLER_INFO_ROUTE } from '../../utils/consts';
import styles from './ModelPage.module.css';
import StarRating from '../UI/StarRating/StarRating';

const SellerRoute = ({ seller }) => {
  const navigate = useNavigate();

  return (
    <div className='container-item'>
        <div className='container-card'>
            <div className={styles.model_seller}>
                <div className={styles.model_seller_info}>
                    <span>Seller: {seller?.sellerInformation?.sellerName}</span>
                    <StarRating rating={seller?.sellerInformation?.sellerRating?.toFixed(1) || 0} readonly />
                </div>
                <Button 
                    type="primary"
                    onClick={() => navigate(`${SELLER_INFO_ROUTE}/${seller.id}`)}
                >
                    View profile
                </Button>
            </div>
        </div>
    </div>
  );
};

export default SellerRoute;