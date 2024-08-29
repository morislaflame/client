import React, { useEffect, useState } from 'react';
import './ThingPage.css';
import Carousel from 'react-bootstrap/Carousel';
import {useParams} from 'react-router-dom';
import { fetchOneThing } from '../../http/thingAPI';
import FaqAccordion from '../../components/FaqAccordion/FaqAccordion';

const ThingPage = () => {
  const [thing, setThing] = useState({info: [], images: []});
  const {id} = useParams();

  useEffect(() => {
    fetchOneThing(id).then(data => setThing(data));
  }, [id]);

  return (
    <div className={'thing-content'}>
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
              <span>AGE: {info.age}</span>
              <span>SMARTPHONE: {info.smartphone}</span>
              <span>% FOR HER: {info.percent}</span>
              <span>TIME PER DAY: {info.time}</span>
              <span>ENGLISH LEVEL: {info.english}</span>
            </div>
          )}
        </div>
        <div className='price-n-buy'>
          <span className='price'>{thing.price} руб</span>
          <button className='buy'>Добавить в корзину</button>
          <img className='payment-ico' src={`${process.env.REACT_APP_API_URL}/tether.png`} alt={`Slide`}/>
        </div>
        <FaqAccordion className='accord'/>
    </div>
  );
};

export default ThingPage;
