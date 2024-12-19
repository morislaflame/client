// components/AdminComponents/AdminModals.js

import React, { useState } from 'react';
import CreateAdultPlatform from './adminModals/CreateAdultPlatform';
import CreateSellerModel from '../SellerComponents/modals/CreateSellerModel';
import CreateCountry from './adminModals/CreateCountry';
import CreateStory from './adminModals/CreateStory';
import CreatePromoCode from './adminModals/CreatePromoCode';
import styles from './AdminComponents.module.css';
import { Button } from 'antd';

const AdminControls = () => {
  const [adultPlatformVisible, setAdultPlatformVisible] = useState(false);
  const [countryVisible, setCountryVisible] = useState(false);
  const [modelVisible, setModelVisible] = useState(false);
  const [storyVisible, setStoryVisible] = useState(false);
  const [promoVisible, setPromoVisible] = useState(false);

  return (
    <>
      <div className="container-item">
        <div className={styles.search_section}>
          <h3>Admin Controls</h3>
          <div className={styles.admin_buttons}>
            <Button onClick={() => {
              if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
              }
              setCountryVisible(true);
            }}>Add country</Button>
            <Button onClick={() => {
              if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
              }
              setAdultPlatformVisible(true);
            }}>Add adult platform</Button>
            <Button onClick={() => {
              if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
              }
              setStoryVisible(true);
            }}>Add story</Button>
              <Button onClick={() => {
              if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
              }
              setPromoVisible(true);
            }}>Add promo code</Button>
            <Button onClick={() => {
              if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
              }
              setModelVisible(true);
            }}>Add model</Button>
          </div>
        </div>
      </div>
      <CreateAdultPlatform show={adultPlatformVisible} onHide={() => setAdultPlatformVisible(false)} />
      <CreateSellerModel show={modelVisible} onHide={() => setModelVisible(false)} />
      <CreateCountry show={countryVisible} onHide={() => setCountryVisible(false)} />
      <CreateStory show={storyVisible} onHide={() => setStoryVisible(false)} />
      <CreatePromoCode show={promoVisible} onHide={() => setPromoVisible(false)} />
    </>
  );
};

export default AdminControls;
