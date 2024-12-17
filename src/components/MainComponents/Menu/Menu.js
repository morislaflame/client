import React, { useContext, useState } from 'react';
import { Drawer, Button } from 'antd';
import styles from './Menu.module.css';
import { Context } from '../../../index';
import {
  SELLER_ACCOUNT_ROUTE,
  SHOP_ROUTE,
  PRIVACY_ROUTE,
  TERMS_ROUTE,
  ADMIN_ROUTE,
  LOGIN_ROUTE,
  MAIN_ROUTE,
  ALL_USER_ORDERS_ROUTE,
  ALL_USER_MODELS_ROUTE,
} from '../../../utils/consts';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserAlt } from 'react-icons/fa';
import { AiFillDollarCircle } from 'react-icons/ai';
import { FaTelegram } from 'react-icons/fa';
import { FaCartShopping } from 'react-icons/fa6';
import { FaUsers } from 'react-icons/fa';
import { IoShieldCheckmarkSharp } from 'react-icons/io5';
import BecomeSellerModal from '../../FuctionalComponents/modals/BecomeSellerModal/BecomeSellerModal';

const Menu = ({ open, onClose }) => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [isSellerModalVisible, setIsSellerModalVisible] = useState(false);

  const logOut = () => {
    user.logout();
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
    }
    navigate(LOGIN_ROUTE);
    onClose(); // Закрываем Drawer после выхода
  };

  return (
    <Drawer onClose={onClose} open={open} width="auto">
      <div className={styles.userinfo}>
          <p>
            {user.user.email || user.user.username || `Telegram ID: ${user.user.telegramId}`}
          </p>
          {user.user.role === 'ADMIN' && (
              <Button
                type="primary"
                block
                onClick={() => {
                  navigate(ADMIN_ROUTE);
                  onClose();
                }}
                style={{ marginTop: '8px' }}
              >
                Админка
              </Button>
            )}

            {user.isAuth && user.user.role !== 'SELLER' && user.user.role !== 'ADMIN' && (
              <button
                onClick={() => setIsSellerModalVisible(true)}
                className={styles.become_seller_button}
              >
                Become a seller
              </button>
            )}
      </div>
      <div className={styles.links_container}>
        {user.isAuth ? (
          <>
            {user.user.role === 'SELLER' && (
              <NavLink
                to={SELLER_ACCOUNT_ROUTE}
                onClick={onClose}
                className={styles.menuLink}
              >
                <AiFillDollarCircle /> Seller Account
              </NavLink>
            )}
            
           
          </>
        ) : (
          <Button
            type="primary"
            block
            onClick={() => {
              navigate(LOGIN_ROUTE);
              onClose();
            }}
            style={{ marginTop: '8px' }}
          >
            Login
          </Button>
        )}
        {/* Другие ссылки */}
        <NavLink
          to={ALL_USER_ORDERS_ROUTE}
          onClick={onClose}
          className={styles.menuLink}
        >
          <FaUserAlt /> My Orders
        </NavLink>
        <NavLink
          to={ALL_USER_MODELS_ROUTE}
          onClick={onClose}
          className={styles.menuLink}
        >
          <FaUserAlt /> My Models
        </NavLink>
        <NavLink
          to={SHOP_ROUTE}
          onClick={onClose}
          className={styles.menuLink}
        >
          <FaCartShopping /> Shop
        </NavLink>
        <NavLink
          to={PRIVACY_ROUTE}
          onClick={onClose}
          className={styles.menuLink}
        >
          <FaUsers /> Referral Program
        </NavLink>
        <NavLink
          to={TERMS_ROUTE}
          onClick={onClose}
          className={styles.menuLink}
        >
          <IoShieldCheckmarkSharp /> Terms of Warranty
        </NavLink>
        <NavLink
          to={MAIN_ROUTE}
          onClick={onClose}
          className={styles.menuLink}
        >
          <FaTelegram /> About Us
        </NavLink>
        
      </div>
      <Button
        type="primary"
        danger
        block
        onClick={logOut}
        style={{ fontWeight: 500 }}
      >
        Log Out
      </Button>
      <BecomeSellerModal 
        visible={isSellerModalVisible} 
        onClose={() => setIsSellerModalVisible(false)} 
      />
    </Drawer>
  );
};

export default Menu;
