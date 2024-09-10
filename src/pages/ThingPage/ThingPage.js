import React, { useEffect, useState, useContext } from 'react';
import './ThingPage.css';
import Carousel from 'react-bootstrap/Carousel';
import { useParams } from 'react-router-dom';
import { fetchOneThing } from '../../http/thingAPI';
import FaqAccordion from '../../components/FaqAccordion/FaqAccordion';
import StorySlider from '../../components/StorySlider/StorySlider';
import { Context } from '../../index';
import { FaShoppingCart } from 'react-icons/fa';
import { Button } from 'react-bootstrap';
import { BASKET_ROUTE } from '../../utils/consts';
import { useNavigate } from 'react-router-dom';
import MymIcon from '../../icons/Mym.png';
import FanslyIcon from '../../icons/fansly.png';
import OnlyIcon from '../../icons/onlyfans.png'

const ThingPage = () => {
  const [thing, setThing] = useState({ info: [], images: [] });
  const { id } = useParams();
  const { thing: thingStore } = useContext(Context); // Получаем доступ к ThingStore

  const navigate = useNavigate();

  useEffect(() => {
    fetchOneThing(id).then(data => setThing(data));
  }, [id]);

  const handleAddToBasket = () => {
    thingStore.addToBasket(id).then(() => {
        alert('Товар добавлен в корзину!');
    }).catch(error => {
        alert('Ошибка при добавлении товара в корзину: ' + error.message);
    });
  };

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

const typeIcons = {
  1: '🍎',
  2: '🇺🇦',
  3: '🍎'
};

  return (
    <div className={'thing-content'}>
      <StorySlider/>
      <div className='name'>
        <h2 className={'topic'}>{thing.name}</h2>
      </div>
      <div className='main-model'>
        <div className='photo'>
          <Carousel data-bs-theme="dark" className='thing-carousel'>
            {thing.images.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  className="photos"
                  src={process.env.REACT_APP_API_URL + image.img}
                  alt={`Slide ${index + 1}`}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
        
        <div className='description'>
          <div className="brands">
              {thing.brands && thing.brands.length > 0 ? (
                      thing.brands.map(brand => (
                          <div 
                              key={brand.id} 
                              style={brandStyles[brand.id] || { color: 'black' }}  // Применяем стиль, если он есть
                              className="brand-item"
                          >
                              {brandIcons[brand.id] && (
                                  <img 
                                      src={brandIcons[brand.id]} 
                                      alt={`${brand.name} icon`} 
                                      className="brands-icons"
                                  />
                              )}
                              {/* {brand.name} */}
                          </div>
                      ))
                  ) : (
                      <div>Unknown Brand</div>
                  )}
          </div>
        {/* Отображение типа товара */}
          <div className="thing-type">
            {thing.type && (
              <div className="type-item">
                {typeIcons[thing.type.id] && (
                  <span className="type-icon">{typeIcons[thing.type.id]}</span>
                )}
                <div className='info-str'><span>Origin:</span> <div>{thing.type.name}</div></div>
          </div>
          )}
        </div>
          {thing.info.map((info, index) =>
            <div key={info.id} className='des_str'>
              
              <div className='info-str'><span>Age:</span> <div>{info.age}</div></div>
              
              <div className='info-str'><span>Smartphone:</span> <div>{info.smartphone}</div></div>
              
              <div className='info-str'><span>% For Her:</span> <div>{info.percent}</div></div>
              
              <div className='info-str'><span>Time Per Day:</span> <div>{info.time}</div></div>
              
              <div className='info-str'><span>English Skills:</span> <div>{info.english}</div></div>
              
              <div className='info-str'><span>Content:</span> <div>{info.content}</div></div>
            
              <div className='info-str'><span>When She Can Start:</span> <div>{info.start}</div></div>
              
              <div className='info-str'><span>Social Media Set Up:</span> <div>{info.socialmedia}</div></div>
              
              <div className='info-str'><span>Willing To Do TikTok:</span> <div>{info.tiktok}</div></div>
              
              <div className='info-str'><span>Does She Need Any Countries Blocked:</span> <div>{info.cblocked}</div></div>
              
              <div className='info-str'><span>OF Verified:</span> <div>{info.ofverif}</div></div>
              
              <div className='info-str'><span>Contract Signed:</span> <div>{info.contract}</div></div>
            </div>
          )}
        </div>
      </div>
      
      <div className='price-n-buy'>
        <span className='price'>${thing.price}</span>
        <div className='add-to-card'>
          <button className='buy' onClick={handleAddToBasket}>Добавить в корзину</button>
          <Button
            className='shopping-card'
            variant="outline-dark"
            onClick={() => navigate(BASKET_ROUTE)}
            style={{height: '100%' }}
          >
            <FaShoppingCart size={28} />
          </Button>
        </div>
        {/* <img className='payment-ico' src={`${process.env.REACT_APP_API_URL}/tether.png`} alt="Payment icon"/> */}
        
      </div>
      <FaqAccordion className='accord'/>
    </div>
  );
};

export default ThingPage;
