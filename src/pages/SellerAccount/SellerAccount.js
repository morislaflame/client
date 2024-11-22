import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import SellerModels from '../../components/SellerComponents/SellerModels';
import SellerOrders from '../../components/SellerComponents/SellerOrders'; // Импортируем SellerOrders
import CreateSellerModel from '../../components/SellerComponents/modals/CreateSellerModel';
import styles from './SellerAccount.module.css';
import BackButtons from '../../components/BackButton/Backbuttons';
import { MdStar } from "react-icons/md";
import { GoNote } from "react-icons/go";
import { IoIosReturnLeft } from "react-icons/io";
import { FaComment } from "react-icons/fa";
import { IoWomanSharp } from "react-icons/io5";

const SellerAccount = observer(() => {
  const { seller } = useContext(Context);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('models'); // Добавили состояние

  useEffect(() => {
    seller.loadMyInformation();
  }, [seller]);

  const { sellerInfo } = seller;

  return (
    <div className={styles.sellerAccount}>
      <div className={styles.topic_back}>
        <BackButtons />
        <h2>Seller Account</h2>
      </div>
      <div className={styles.shop_menu}>
        <div className={styles.shop_name_rating}>
          <h3>{sellerInfo.sellerInformation?.sellerName}</h3>
          <div className={styles.shop_rating}>
            <h5>{sellerInfo.sellerInformation?.sellerRating}</h5>
            <MdStar style={{color: '#FFD700'}} />
          </div>
        </div>
        <div className={styles.shop_info}>
          <h5>"{sellerInfo.sellerInformation?.sellerInfo}"</h5>
        </div>
        <div className={styles.menu_info}>
          <div className={styles.menu_links}>
            <button className={styles.menu_link} onClick={() => setSelectedTab('models')}>
            <IoWomanSharp />My Models
            </button>
            <button className={styles.menu_link} onClick={() => setSelectedTab('orders')}>
              <GoNote />My Orders
            </button>
            <button className={styles.menu_link} onClick={() => setSelectedTab('returns')}>
              <IoIosReturnLeft />My Returns
            </button>
            <button className={styles.menu_link} onClick={() => setSelectedTab('reviews')}>
              <FaComment />My Reviews
            </button>
          </div>
          <div className={styles.total_info}>
            <h5>Total Earned</h5>
            <h5>$500</h5>
          </div>
        </div>
      </div>

      {selectedTab === 'models' && (
        <>
          <SellerModels onAddModel={() => setShowCreateModal(true)} />
          <CreateSellerModel show={showCreateModal} onHide={() => setShowCreateModal(false)} />
        </>
      )}

      {selectedTab === 'orders' && (
        <div className={styles.orders}>
          <h3>My Orders</h3>
          <SellerOrders />
        </div>
      )}

      {selectedTab === 'returns' && (
        <div className={styles.returns}>
          <h3>My Returns</h3>
          {/* Здесь вы можете добавить компонент для возвратов */}
        </div>
      )}

      {selectedTab === 'reviews' && (
        <div className={styles.reviews}>
          <h3>My Reviews</h3>
          {/* Здесь вы можете добавить компонент для отзывов */}
        </div>
      )}
    </div>
  );
});

export default SellerAccount;
