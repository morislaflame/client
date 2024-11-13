import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { Button, Spin } from 'antd';
import SellerModels from '../../components/SellerComponents/SellerModels';
import CreateSellerModel from '../../components/SellerComponents/modals/CreateSellerModel'; // Импортируем модальное окно
import styles from './SellerAccount.module.css';
import BackButtons from '../../components/BackButton/Backbuttons';
import { MdStar } from "react-icons/md";
import { NavLink } from 'react-router-dom';
import { SELLER_ACCOUNT_ROUTE } from '../../utils/consts';
import { GoNote } from "react-icons/go";
import { IoIosReturnLeft } from "react-icons/io";
import { FaComment } from "react-icons/fa";

const SellerAccount = observer(() => {
  const { user } = useContext(Context);
  const [showCreateModal, setShowCreateModal] = useState(false);



  return (
    <div className={styles.sellerAccount}>
      <div className={styles.topic_back}>
        <BackButtons />
        <h2>Seller Account</h2>
      </div>
      <div className={styles.shop_menu}>
        <div className={styles.shop_name_rating}>
            <h3>SHOP NAME</h3>
            <div className={styles.shop_rating}><h5>5</h5><MdStar style={{color: '#FFD700'}} /></div>
        </div>
        <div className={styles.menu_info}>
            <div className={styles.menu_links}>
                <NavLink to={SELLER_ACCOUNT_ROUTE} className={styles.menu_link}><GoNote />My Orders</NavLink>
                <NavLink to={SELLER_ACCOUNT_ROUTE} className={styles.menu_link}><IoIosReturnLeft />My Returns</NavLink>
                <NavLink to={SELLER_ACCOUNT_ROUTE} className={styles.menu_link}><FaComment />My Reviews</NavLink>
            </div>
            <div className={styles.total_info}>
                <h5>Total Earned</h5>
                <h5>$500</h5>
            </div>
        </div>
      </div>
      
      <div className={styles.models}>
        <div className={styles.models_header}>
            <h3>My Models</h3> 
            <div className={styles.buttons}>
                <button className={styles.add_model_button} onClick={() => setShowCreateModal(true)}>
                    Add Model
                </button>
            </div>
        </div>
        
        <SellerModels />
      </div>
      
      <CreateSellerModel show={showCreateModal} onHide={() => setShowCreateModal(false)} />
    </div>
  );
});

export default SellerAccount;
