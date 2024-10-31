// components/UserModels.js

import React, { useContext, useEffect, useState, useCallback } from 'react';
import styles from './UserComponents.module.css';
import { GiHighHeel } from 'react-icons/gi';
import { Dropdown } from 'antd';
import { LiaExchangeAltSolid } from 'react-icons/lia';
import { IoReturnDownBackOutline } from 'react-icons/io5';
import { SlOptionsVertical } from 'react-icons/sl';
import { THING_ROUTE } from '../../utils/consts';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import placeholder from '../../icons/placeholder.jpg';

const UserModels = observer(({ handleShow }) => {
  const { user, exchange, return: returnStore } = useContext(Context);
  const navigate = useNavigate();
  const [openDropdowns, setOpenDropdowns] = useState({});

  useEffect(() => {
    user.loadPurchasedThings(); // Загрузка купленных вещей
    exchange.loadUserExchangeRequests();
    returnStore.loadUserReturns();
  }, [user, exchange, returnStore]);

  const handleDropdownVisibleChange = useCallback((flag, thingId) => {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [thingId]: flag,
    }));
  }, []);

  const handleMenuClick = useCallback(
    (action, thingItem) => {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
      }
      if (action === 'exchange') {
        navigate(`/exchange/${thingItem.id}`);
      } else if (action === 'return') {
        handleShow(thingItem);
      }

      setOpenDropdowns((prevState) => ({
        ...prevState,
        [thingItem.id]: false,
      }));
    },
    [navigate, handleShow]
  );

  const getDropdownMenu = useCallback(
    (thingItem, hasExchangeRequest, hasReturnRequest) => ({
      items: [
        {
          key: 'exchange',
          icon: <LiaExchangeAltSolid />,
          disabled: hasExchangeRequest,
          label: hasExchangeRequest ? 'Exchange request sent' : 'Request an exchange',
          onClick: () => handleMenuClick('exchange', thingItem),
        },
        {
          key: 'return',
          icon: <IoReturnDownBackOutline />,
          disabled: hasReturnRequest,
          label: hasReturnRequest ? 'Return in processing' : 'Make a refund',
          onClick: () => handleMenuClick('return', thingItem),
        },
      ],
    }),
    
    [handleMenuClick]
  );

  const { purchasedThings } = user;
  const { exchangeRequests } = exchange;
  const { returns } = returnStore;

  if (user.loading || exchange.loading || returnStore.loading) {
    return <div><LoadingIndicator/></div>;
  }

  return (
    <div className={styles.my_things}>
      <h3>My Models</h3>
      {purchasedThings && purchasedThings.length > 0 ? (
        <div className={styles.things_list}>
          {purchasedThings.map((thingItem) => {
            const hasExchangeRequest = exchangeRequests?.some(
              (exchangeItem) =>
                exchangeItem.oldThingId === thingItem.id && exchangeItem.status === 'pending'
            );

            const hasReturnRequest = returns?.some(
              (returnItem) =>
                returnItem.thingId === thingItem.id && returnItem.status === 'pending'
            );

            return (
              <div className={styles.thing_item} key={thingItem.id}>
                <div className={styles.thing_image_wrapper} style={{ zIndex: '100' }}>
                  {thingItem.images && thingItem.images.length > 0 && (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/${thingItem.images[0].img}`}
                      alt={thingItem.name}
                      className={styles.thing_image}
                      onError={(e) => {
                        e.target.src = placeholder;
                      }}
                      onClick={() => navigate(THING_ROUTE + '/' + thingItem.id)}
                    />
                  )}
                </div>
                <div className={styles.thing_details}>
                  <div className={styles.name_price}>
                    <div className={styles.name_heel}>
                      <GiHighHeel />
                      <span>{thingItem.name}</span>
                    </div>
                    <span>${thingItem.price}</span>
                  </div>
                  <div className={styles.dropdownmenusection}>
                    <Dropdown
                      menu={getDropdownMenu(thingItem, hasExchangeRequest, hasReturnRequest)}
                      trigger={['click']}
                      onOpenChange={(flag) => handleDropdownVisibleChange(flag, thingItem.id)}
                      open={openDropdowns[thingItem.id] || false}
                    >
                      <div className={styles.dropdownmenu}>
                        <div onClick={(e) => e.preventDefault()} className={styles.dropdownTrigger}>
                          <span>Actions</span>
                          <SlOptionsVertical
                            className={`${styles.rotateIcon} ${
                              openDropdowns[thingItem.id] ? styles.open : ''
                            }`}
                          />
                        </div>
                      </div>
                    </Dropdown>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <span className={styles.placeholder}>You don't have any Models.</span>
      )}
    </div>
  );
});

export default UserModels;
