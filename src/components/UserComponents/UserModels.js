// components/UserModels.js

import React, { useContext, useEffect, useState, useCallback } from 'react';
import styles from './UserComponents.module.css';
import { GiHighHeel } from 'react-icons/gi';
import { Dropdown, Menu } from 'antd';
import { LiaExchangeAltSolid } from 'react-icons/lia';
import { IoReturnDownBackOutline } from 'react-icons/io5';
import { SlOptionsVertical } from 'react-icons/sl';
import { THING_ROUTE } from '../../utils/consts';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';

const UserModels = observer(({ handleShow }) => {
  const { user, exchange, return: returnStore } = useContext(Context);
  const navigate = useNavigate();
  const [openDropdowns, setOpenDropdowns] = useState({});

  useEffect(() => {
    user.loadPurchasedThings(); // Load purchased things
    exchange.loadUserExchangeRequests();
    returnStore.loadUserReturns();
  }, [user, exchange, returnStore]);

  const handleDropdownVisibleChange = useCallback((flag, thingId) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [thingId]: flag,
    }));
  }, []);

  const handleMenuClick = useCallback(
    (action, thingItem) => {
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
    (thingItem, hasExchangeRequest, hasReturnRequest) => (
      <Menu>
        <Menu.Item
          key="exchange"
          icon={<LiaExchangeAltSolid />}
          disabled={hasExchangeRequest}
          onClick={() => handleMenuClick('exchange', thingItem)}
        >
          {hasExchangeRequest ? 'Exchange request sent' : 'Request an exchange'}
        </Menu.Item>
        <Menu.Item
          key="return"
          icon={<IoReturnDownBackOutline />}
          disabled={hasReturnRequest}
          onClick={() => handleMenuClick('return', thingItem)}
        >
          {hasReturnRequest ? 'Return in processing' : 'Make a refund'}
        </Menu.Item>
      </Menu>
    ),
    [handleMenuClick]
  );

  const { purchasedThings } = user;
  const { exchangeRequests } = exchange;
  const { returns } = returnStore;

  if (user.loading || exchange.loading || returnStore.loading) {
    return <p>Loading models...</p>;
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
                        e.target.src = '/path/to/default/image.jpg';
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
                      overlay={getDropdownMenu(thingItem, hasExchangeRequest, hasReturnRequest)}
                      trigger={['click']}
                      onVisibleChange={(flag) => handleDropdownVisibleChange(flag, thingItem.id)}
                      visible={openDropdowns[thingItem.id] || false}
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
