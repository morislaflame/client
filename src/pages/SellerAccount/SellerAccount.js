import React, { useEffect, useContext, useState, useLayoutEffect } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import SellerModels from '../../components/SellerComponents/SellerModels';
import SellerOrders from '../../components/SellerComponents/SellerOrders'; // Импортируем SellerOrders
import CreateSellerModel from '../../components/SellerComponents/modals/CreateSellerModel';
import styles from './SellerAccount.module.css';
import { GoNote } from "react-icons/go";
import { FaComment } from "react-icons/fa";
import { IoWomanSharp } from "react-icons/io5";
import ChangeInfoModal from '../../components/SellerComponents/modals/ChangeInfoModal';
import TopicBack from '../../components/FuctionalComponents/TopicBack/TopicBack';
import StarRating from '../../components/UI/StarRating/StarRating';
import SellerReviews from '../../components/SellerComponents/SellerReviews';
import { DownAnimation } from '../../components/Animations/DownAnimation';

const SellerAccount = observer(() => {
  const { seller } = useContext(Context);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('models');
  const [changeInfoModalVisible, setChangeInfoModalVisible] = useState(false);

  useEffect(() => {
    seller.loadMyInformation();
  }, [seller]);

  useLayoutEffect(() => {
    DownAnimation('#shop_menu');
  }, []);

  const { sellerInfo } = seller;

  return (
    <div className="container">
      <TopicBack title="Seller Account" />
      <div className={styles.shop_menu} id='shop_menu'>
        <div className={styles.shop_name_rating}>
          <div className={styles.shop_name}>
            <h3>{sellerInfo.sellerInformation?.sellerName}</h3>
            <button 
            onClick={() => setChangeInfoModalVisible(true)}
            className={styles.change_info_button}
          >
              Change info
            </button>
          </div>
          <div className={styles.shop_rating}>
          {sellerInfo.sellerInformation?.sellerRating.toFixed(1) || 0}
          <StarRating rating={sellerInfo.sellerInformation?.sellerRating.toFixed(1) || 0} readonly />
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
          <SellerOrders />
        </div>
      )}

      {selectedTab === 'reviews' && (
        <div className={styles.reviews}>
          <SellerReviews reviews={sellerInfo.sellerReviews} />
        </div>
      )}
      <ChangeInfoModal
        visible={changeInfoModalVisible}
        onClose={() => setChangeInfoModalVisible(false)}
      />
    </div>
    
  );
});

export default SellerAccount;
