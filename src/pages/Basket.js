// components/Basket/Basket.js

import React, { useEffect, useState, useContext } from 'react';
import './Basket.css';
import { fetchBasket, removeFromBasket, clearBasket } from '../http/basketAPI';
import { useNavigate } from 'react-router-dom';
import { Context } from '../index';
import MyButton from '../components/MyButton/MyButton';
import MySecondBtn from '../components/MySecondBtn/MySecondBtn';
import MymIcon from '../icons/Mym.png';
import FanslyIcon from '../icons/fansly.png';
import OnlyIcon from '../icons/onlyfans.png';
import ListGroup from 'react-bootstrap/ListGroup'; // Добавляем импорт ListGroup

const Basket = () => {
  const [basket, setBasket] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();
  const { thing } = useContext(Context); // Получаем доступ к ThingStore

  const brandStyles = {
    1: { color: '#008ccf' },  // Стиль для бренда с id: 1
    2: { color: '#1fa7df' },   // Стиль для бренда с id: 2
    3: { color: '#e8642c' }
  };

  // Иконки для брендов
  const brandIcons = {
    1: OnlyIcon,  // URL для иконки бренда с id: 1
    2: FanslyIcon,   // URL для иконки бренда с id: 2
    3: MymIcon
  };

  useEffect(() => {
    loadBasket();
  }, []);

  const loadBasket = async () => {
    try {
      const data = await fetchBasket();
      setBasket(data.items || []);
      calculateTotalAmount(data.items || []);
    } catch (error) {
      console.error('Ошибка при загрузке корзины:', error);
      alert('Не удалось загрузить корзину.');
    }
  };

  const calculateTotalAmount = (basketItems) => {
    const total = basketItems.reduce((sum, item) => sum + item.price, 0);
    setTotalAmount(total);
  };

  const handleRemove = async (thingId) => {
    try {
      await removeFromBasket(thingId); // Удаляем через API
      const updatedBasket = basket.filter(item => item.id !== thingId);
      setBasket(updatedBasket);
      calculateTotalAmount(updatedBasket);
    } catch (error) {
      alert('Ошибка при удалении товара из корзины: ' + error.message);
    }
  };

  const handleClearBasket = async () => {
    try {
      await clearBasket(); // Очищаем через API
      setBasket([]);
      setTotalAmount(0);
    } catch (error) {
      alert('Ошибка при очистке корзины: ' + error.message);
    }
  };

  if (basket.length === 0) {
    return <div className="basket-empty">Your Cart Is Empty</div>;
  }

  const handlePayment = () => {
    navigate('/payment', { state: { totalAmount } });  // Переход на страницу оплаты с передачей суммы
  };

  return (
    <div className="basket-page">
      <h2>Your cart</h2>
      
      <div className="basket-items">
        {basket.map(item => (
          <div key={item.id} className="basket-item">
            <img src={process.env.REACT_APP_API_URL + item.images[0].img} alt={item.name} className="basket-item-img" />
            <div className="basket-item-info">
              <div className='info-brand'>
                <div className="brands-basket">
                  {item.brands && item.brands.length > 0 ? (
                    item.brands.map(brand => (
                      <div 
                        key={brand.id} 
                        style={brandStyles[brand.id] || { color: 'black' }}  // Применяем стиль, если он есть
                        className="brand-item-basket"
                      >
                        {brandIcons[brand.id] && (
                          <img 
                            src={brandIcons[brand.id]} 
                            alt={`${brand.name} icon`} 
                            className="brands-icons-basket"
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <div>Unknown Brand</div>
                  )}
                </div>
                <div className='items-name-price'>
                  <span className="basket-item-name">{item.name}</span>
                  {/* Отображаем оригинальную цену только если она отличается от текущей */}
                  {item.originalPrice && item.price !== item.originalPrice && (
                    <span className="basket-item-original-price" style={{ textDecoration: 'line-through', color: 'grey' }}>
                      ${item.originalPrice}
                    </span>
                  )}
                  <span className="basket-item-price">${item.price}</span>
                </div>
              </div>
              <button onClick={() => handleRemove(item.id)} className="basket-item-remove">Remove</button>
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
