// components/AdminComponents/AdminModals.js

import React, { useState } from 'react';
import CreateAdultPlatform from './adminModals/CreateAdultPlatform';
import CreateSellerModel from '../SellerComponents/modals/CreateSellerModel';
import CreateCountry from './adminModals/CreateCountry';
import CreateStory from './adminModals/CreateStory';
import CreatePromoCode from './adminModals/CreatePromoCode';
import styles from './AdminComponents.module.css';

const AdminControls = () => {
  const [adultPlatformVisible, setAdultPlatformVisible] = useState(false);
  const [countryVisible, setCountryVisible] = useState(false);
  const [modelVisible, setModelVisible] = useState(false);
  const [storyVisible, setStoryVisible] = useState(false);
  const [promoVisible, setPromoVisible] = useState(false);

  return (
    <>
      <div className={styles.admin_buttons}>
        <button onClick={() => setCountryVisible(true)}>Add country</button>
        <button onClick={() => setAdultPlatformVisible(true)}>Add adult platform</button>
        <button onClick={() => setStoryVisible(true)}>Add story</button>
        <button onClick={() => setPromoVisible(true)}>Add promo code</button>
        <button onClick={() => setModelVisible(true)}>Add model</button>
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
