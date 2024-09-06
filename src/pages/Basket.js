import React, { useEffect, useState, useContext } from 'react';
import './Basket.css';
import { fetchBasket, removeFromBasket, clearBasket } from '../http/basketAPI';
import { useNavigate } from 'react-router-dom';
import { Context } from '../index';
import MyButton from '../components/MyButton/MyButton';
import MySecondBtn from '../components/MySecondBtn/MySecondBtn';

const Basket = () => {
  const [basket, setBasket] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();
  const { thing } = useContext(Context); // Получаем доступ к ThingStore

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

  const handleRemove = async (thingId) => {
    try {
      await thing.removeFromBasket(thingId); // Удаляем через ThingStore для синхронизации
      const updatedBasket = basket.filter(item => item.thingId !== thingId);
      setBasket(updatedBasket);
      calculateTotalAmount(updatedBasket);
    } catch (error) {
      alert('Ошибка при удалении товара из корзины: ' + error.message);
    }
  };

  const handleClearBasket = async () => {
    try {
      await thing.clearBasket(); // Очищаем через ThingStore для синхронизации
      setBasket([]);
      setTotalAmount(0);
    } catch (error) {
      alert('Ошибка при очистке корзины: ' + error.message);
    }
  };

  if (basket.length === 0) {
    return <div className="basket-empty">Ваша корзина пуста</div>;
  }

  const handlePayment = () => {
    navigate('/payment', { state: { totalAmount } });  // Переход на страницу оплаты с передачей суммы
  };

  return (
    <div className="basket-page">
      <h2>Your cart</h2>
      
      <div className="basket-items">
        {basket.map(item => (
          <div key={item.thing.id} className="basket-item">
            <img src={process.env.REACT_APP_API_URL + item.thing.images[0].img} alt={item.thing.name} className="basket-item-img" />
            <div className="basket-item-info">
              <span className="basket-item-name">{item.thing.name}</span>
              <span className="basket-item-price">${item.thing.price}</span>
              <button onClick={() => handleRemove(item.thingId)} className="basket-item-remove">Remove</button>
            </div>
          </div>
        ))}
        <MySecondBtn className="clear-basket" text={'Clear cart'} onClick={handleClearBasket}></MySecondBtn>
      </div>
      <div className="basket-total">
        <h3>Total amount: ${totalAmount}</h3>
        <MyButton className="pay-button" text={'Go to payment'} onClick={handlePayment}></MyButton>
        
      </div>
    </div>
  );
};

export default Basket;
