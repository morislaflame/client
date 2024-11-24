import React, { useContext, useState, useCallback } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from './UserAccount.module.css';
import BackButton from '../../components/BackButton/BackButton';
import UserOrders from '../../components/UserComponents/UserOrders';
import UserReturns from '../../components/UserComponents/UserReturns';
import UserExchanges from '../../components/UserComponents/UserExchanges';
import UserModels from '../../components/UserComponents/UserModels';
import ReturnRequestModal from '../../components/FuctionalComponents/modals/ReturnRequestModal';

const UserAccount = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [selectedThing, setSelectedThing] = useState(null); // Выбранный товар для возврата
  const [showReturnModal, setShowReturnModal] = useState(false);

  const handleCloseReturnModal = useCallback(() => {
    setShowReturnModal(false);
    setSelectedThing(null);
  }, []);

  const handleShowReturnModal = useCallback((thing) => {
    setSelectedThing(thing);
    setShowReturnModal(true);
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
    }
  }, []);

  const handleExchangeRequest = useCallback((thingItem) => {
    navigate(`/exchange/${thingItem.id}`);
  }, [navigate]);


  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    autoplay: false,
    slidesToShow: 1,
    arrows: false,
    centerMode: true,
    centerPadding: "20px",
    focusOnSelect: true,
    adaptiveHeight: true,
    lazyLoad: 'ondemand',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Проверяем, есть ли информация о пользователе
  if (!user.user) {
    return <Spinner animation="border" />;
  }

  return (
    <div className={styles.useraccount}>
      <div className={styles.topic}>
        <div className={styles.topic_back}>
          <BackButton />
          <h2>Account</h2>
        </div>
        <div className={styles.userinfo}>
          <p>
            {user.user.email || user.user.username || `Telegram ID: ${user.user.telegramId}`}
          </p>
        </div>
      </div>

      <UserModels
        handleShow={handleShowReturnModal}
        handleExchangeRequest={handleExchangeRequest}
      />

      <UserOrders sliderSettings={sliderSettings} />

      <UserReturns sliderSettings={sliderSettings} />

      <UserExchanges sliderSettings={sliderSettings} />

      <ReturnRequestModal
        show={showReturnModal}
        handleClose={handleCloseReturnModal}
        selectedThing={selectedThing}
      />
    </div>
  );
});

export default UserAccount;







