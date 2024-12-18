import React, { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { Context } from '../../index';
import { LOGIN_ROUTE, ORDER_ROUTE } from '../../utils/consts';
import { playHeartAnimation } from '../../components/Animations/HeartAnimation';
import PurchaseSection from './PurchaseSection';

const PurchaseSectionContainer = ({ modelId, priceUSD }) => {
  const [addingToBasket, setAddingToBasket] = useState(false);
  const [heartAnimation, setHeartAnimation] = useState(false);
  const heartRef = useRef(null);
  
  const navigate = useNavigate();
  const { model, user, order } = useContext(Context);

  const handleCreateOrder = async () => {
    if (!user.isAuth) {
      navigate(LOGIN_ROUTE);
      return;
    }

    setAddingToBasket(true);
    try {
      const newOrder = await order.createOrder({
        modelProductId: modelId,
        chatId: modelId,
      });

      if (newOrder?.id) {
        if (window.Telegram?.WebApp?.HapticFeedback) {
          window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        navigate(`${ORDER_ROUTE}/${newOrder.id}`);
      }
    } catch (error) {
      message.error('Error creating order: ' + (error.response?.data?.message || error.message));
    } finally {
      setAddingToBasket(false);
    }
  };

  const handleAddToFavorites = async () => {
    if (!user.isAuth) {
      navigate(LOGIN_ROUTE);
      return;
    }

    try {
      const basketItem = model.basket.find(item => item.modelProductId === Number(modelId));
      
      if (basketItem) {
        await model.removeFromBasket(basketItem.id);
        message.success('Removed from favorites');
      } else {
        await model.addToBasket(modelId);
        message.success('Added to favorites');
      }

      setHeartAnimation(true);
      playHeartAnimation(heartRef);

      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
      }
    } catch (error) {
      message.error('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setTimeout(() => setHeartAnimation(false), 1000);
    }
  };

  const isInBasket = model.isItemInBasket(modelId);

  return (
    <PurchaseSection
      priceUSD={priceUSD}
      isInBasket={isInBasket}
      addingToBasket={addingToBasket}
      heartRef={heartRef}
      onCreateOrder={handleCreateOrder}
      onAddToFavorites={handleAddToFavorites}
    />
  );
};

export default PurchaseSectionContainer;