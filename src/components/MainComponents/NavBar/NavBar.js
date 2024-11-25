import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../index';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { IoCart } from 'react-icons/io5';
import { AiFillDollarCircle } from 'react-icons/ai';
import { PiListBold } from 'react-icons/pi';
import EMM from '../../../icons/EMM2.png';
import Menu from '../Menu/Menu';
import { BASKET_ROUTE, SELLER_ACCOUNT_ROUTE, SHOP_ROUTE } from '../../../utils/consts';
import './NavBar.css';

const NavBar = observer(() => {
  const { user, model } = useContext(Context);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isAuth) {
      model.loadBasket();
    }
  }, [user.isAuth, model]);

  return (
    <div className="navbar">
      <div className="navbar-content">
        <div
          className="navbar-brand"
          onClick={() => navigate(SHOP_ROUTE)}
          style={{ cursor: 'pointer'}}
        >
          <img src={EMM} alt="EMM" />
        </div>

        <div className="menu">
          {user.isAuth && (
            <>
              {user.user.role === 'SELLER' && (
                <button
                  className="navbar-button"
                  onClick={() => navigate(SELLER_ACCOUNT_ROUTE)}
                >
                    <AiFillDollarCircle />
                </button>
              )}
              <button
                className="navbar-button"
                onClick={() => navigate(BASKET_ROUTE)}
                style={{ position: 'relative' }}
              >
                <IoCart />
                {model.basket.length > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      backgroundColor: '#d70d0d',
                      color: 'white',
                      borderRadius: '50%',
                      padding: '3px 6px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      lineHeight: '1',
                    }}
                  >
                    {model.basket.length}
                  </span>
                )}
              </button>
              
            </>
          )}
          <button
                className="navbar-button"
                onClick={() => setDrawerOpen(true)}
              >
                <PiListBold />
              </button>
        </div>
      </div>
      {/* Используем ваш существующий компонент Menu */}
      <Menu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
});

export default NavBar;
