import React, { useContext } from 'react';
import { Drawer, Button } from 'antd';
import styles from './Menu.module.css';
import { Context } from '../../../index';
import {
  USER_ACCOUNT_ROUTE,
  SELLER_ACCOUNT_ROUTE,
  SHOP_ROUTE,
  PRIVACY_ROUTE,
  TERMS_ROUTE,
  ADMIN_ROUTE,
  LOGIN_ROUTE,
} from '../../../utils/consts';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserAlt } from 'react-icons/fa';
import { AiFillDollarCircle } from 'react-icons/ai';
import { FaTelegram } from 'react-icons/fa';
import { FaCartShopping } from 'react-icons/fa6';
import { FaUsers } from 'react-icons/fa';
import { IoShieldCheckmarkSharp } from 'react-icons/io5';

const Menu = ({ open, onClose }) => {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  const logOut = () => {
    user.logout();
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
    }
    navigate(LOGIN_ROUTE);
    onClose(); // Закрываем Drawer после выхода
  };

  return (
    <Drawer title="Menu" onClose={onClose} open={open} width="auto">
      <h3>Navigation</h3>
      <div className={styles.links_container}>
        {user.isAuth ? (
          <>
            <NavLink
              to={USER_ACCOUNT_ROUTE}
              onClick={onClose}
              className={styles.menuLink}
            >
              <FaUserAlt /> My Account
            </NavLink>
            {user.user.role === 'SELLER' && (
              <NavLink
                to={SELLER_ACCOUNT_ROUTE}
                onClick={onClose}
                className={styles.menuLink}
              >
                <AiFillDollarCircle /> Seller Account
              </NavLink>
            )}
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
            Авторизация
          </Button>
        )}
        {/* Другие ссылки */}
        <NavLink
          to={SHOP_ROUTE}
          onClick={onClose}
          className={styles.menuLink}
        >
          <FaCartShopping /> Магазин
        </NavLink>
        <NavLink
          to={PRIVACY_ROUTE}
          onClick={onClose}
          className={styles.menuLink}
        >
          <FaUsers /> Реферальная программа
        </NavLink>
        <NavLink
          to={TERMS_ROUTE}
          onClick={onClose}
          className={styles.menuLink}
        >
          <IoShieldCheckmarkSharp /> Условия гарантии
        </NavLink>
        <a
          href="https://t.me/express_model_marketplace"
          onClick={onClose}
          className={styles.menuLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTelegram /> Мы в Telegram
        </a>
        <Button
              type="primary"
              danger
              block
              onClick={logOut}
              style={{ marginTop: '8px' }}
            >
              Выйти
            </Button>
      </div>
    </Drawer>
  );
};

export default Menu;
