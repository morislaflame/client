import React, { useEffect, useState, useContext } from 'react';
import './ThingPage.css';
import Carousel from 'react-bootstrap/Carousel';
import { useParams } from 'react-router-dom';
import { fetchOneThing } from '../../http/thingAPI';
import FaqAccordion from '../../components/FaqAccordion/FaqAccordion';
import StorySlider from '../../components/StorySlider/StorySlider';
import { Context } from '../../index';

const ThingPage = () => {
  const [thing, setThing] = useState({ info: [], images: [] });
  const { id } = useParams();
  const { thing: thingStore } = useContext(Context); // Получаем доступ к ThingStore

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

  return (
    <div className={'thing-content'}>
      <StorySlider/>
      <div className='name'>
        <h2 className={'topic'}>{thing.name}</h2>
      </div>
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
        {thing.info.map((info, index) =>
          <div key={info.id} className='des_str'>
            <div className='info-str'><span>ORIGIN:</span> <div>{info.age}</div></div>
            <hr/>
            <div className='info-str'><span>AGE:</span> <div>{info.age}</div></div>
            <hr/>
            <div className='info-str'><span>SMARTPHONE:</span> <div>{info.smartphone}</div></div>
            <hr/>
            <div className='info-str'><span>% FOR HER:</span> <div>{info.percent}</div></div>
            <hr/>
            <div className='info-str'><span>TIME PER DAY:</span> <div>{info.time}</div></div>
            <hr/>
            <div className='info-str'><span>ENGLISH SKILLS:</span> <div>{info.english}</div></div>
            <hr/>
            <div className='info-str'><span>CONTENT:</span> <div>{info.content}</div></div>
            <hr/>
            <div className='info-str'><span>WHEN SHE CAN START:</span> <div>{info.start}</div></div>
            <hr/>
            <div className='info-str'><span>SOCIAL MEDIA SET UP:</span> <div>{info.socialmedia}</div></div>
            <hr/>
            <div className='info-str'><span>WILLING TO DO TIKTOK:</span> <div>{info.tiktok}</div></div>
            <hr/>
            <div className='info-str'><span>Does She Need Any Countries Blocked:</span> <div>{info.cblocked}</div></div>
            <hr/>
            <div className='info-str'><span>OF VERIFIED:</span> <div>{info.ofverif}</div></div>
            <hr/>
            <div className='info-str'><span>Contract Signed:</span> <div>{info.contract}</div></div>
          </div>
        )}
      </div>
      <div className='price-n-buy'>
        <span className='price'>{thing.price} руб</span>
        <button className='buy' onClick={handleAddToBasket}>Добавить в корзину</button>
        <img className='payment-ico' src={`${process.env.REACT_APP_API_URL}/tether.png`} alt="Payment icon"/>
      </div>
      <FaqAccordion className='accord'/>
    </div>
  );
};

export default ThingPage;
