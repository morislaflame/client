// components/AdminComponents/AdminModals.js

import React, { useState } from 'react';
import CreateAdultPlatform from './adminModals/CreateAdultPlatform';
import CreateModel from './adminModals/CreateModel';
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
        <button onClick={() => setCountryVisible(true)}>Добавить страну</button>
        <button onClick={() => setAdultPlatformVisible(true)}>Добавить платформу</button>
        <button onClick={() => setStoryVisible(true)}>Добавить историю</button>
        <button onClick={() => setPromoVisible(true)}>Добавить промокод</button>
        <button onClick={() => setModelVisible(true)}>Добавить модель</button>
      </div>
      <CreateAdultPlatform show={adultPlatformVisible} onHide={() => setAdultPlatformVisible(false)} />
      <CreateModel show={modelVisible} onHide={() => setModelVisible(false)} />
      <CreateCountry show={countryVisible} onHide={() => setCountryVisible(false)} />
      <CreateStory show={storyVisible} onHide={() => setStoryVisible(false)} />
      <CreatePromoCode show={promoVisible} onHide={() => setPromoVisible(false)} />
    </>
  );
};

export default AdminControls;
