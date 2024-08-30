import React, { useEffect, useState } from 'react';
import './Basket.css';
import { fetchBasket, removeFromBasket, clearBasket } from '../http/basketAPI';
import { useNavigate } from 'react-router-dom';

const Basket = () => {
  const [basket, setBasket] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBasket().then(data => {
      setBasket(data.basket_things || []);
      calculateTotalAmount(data.basket_things || []);
    });
  }, []);

  const calculateTotalAmount = (basketItems) => {
    const total = basketItems.reduce((sum, item) => sum + item.thing.price, 0);
    setTotalAmount(total);
  };

  const handleRemove = (thingId) => {
    removeFromBasket(thingId).then(() => {
      const updatedBasket = basket.filter(item => item.thingId !== thingId);
      setBasket(updatedBasket);
      calculateTotalAmount(updatedBasket);
    }).catch(error => {
      alert('Ошибка при удалении товара из корзины: ' + error.response.data.message);
    });
  };

  const handleClearBasket = () => {
    clearBasket().then(() => {
      setBasket([]);
      setTotalAmount(0);
    }).catch(error => {
      alert('Ошибка при очистке корзины: ' + error.response.data.message);
    });
  };

  if (basket.length === 0) {
    return <div className="basket-empty">Ваша корзина пуста</div>;
  }

  const handlePayment = () => {
    navigate('/payment', { state: { totalAmount } });  // Переход на страницу оплаты с передачей суммы
  };

  return (
    <div className="basket-page">
      <h2>Ваша корзина</h2>
      <button className="clear-basket" onClick={handleClearBasket}>Очистить корзину</button>
      <div className="basket-items">
        {basket.map(item => (
          <div key={item.thing.id} className="basket-item">
            <img src={process.env.REACT_APP_API_URL + item.thing.images[0].img} alt={item.thing.name} className="basket-item-img" />
            <div className="basket-item-info">
              <span className="basket-item-name">{item.thing.name}</span>
              <span className="basket-item-price">{item.thing.price} руб</span>
              <button onClick={() => handleRemove(item.thingId)} className="basket-item-remove">Удалить</button>
            </div>
          </div>
        ))}
      </div>
      <div className="basket-total">
        <h3>Общая сумма: {totalAmount} руб</h3>
        <button className="pay-button" onClick={handlePayment}>Перейти к оплате</button>
      </div>
    </div>
  );
};

export default Basket;
