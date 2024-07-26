import React, { useEffect, useState } from 'react';
import './ThingPage.css';
import Carousel from 'react-bootstrap/Carousel';
import {useParams} from 'react-router-dom'
import { fetchOneThing } from '../../http/thingAPI';

const ThingPage = () => {
  const [thing, setThing] = useState({info: []})
  const {id} = useParams()
  useEffect(() => {
    fetchOneThing(id).then(data => setThing(data))
  }, [])

  return (
    <div className={'container'}>
        <div className='name'>
          <h2 className={'topic'}>{thing.name}</h2>
        </div>
        <div className='photo'>
          <Carousel data-bs-theme="dark">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={process.env.REACT_APP_API_URL + thing.img}
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={process.env.REACT_APP_API_URL + thing.img}
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={process.env.REACT_APP_API_URL + thing.img}
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>
        </div>
        <div className='price-n-buy'>
          <span className='price'>{thing.price} руб</span>
          <button className='buy'>Добавить в корзину</button>
        </div>
        <div className='description'>
          {thing.info.map((info, index) =>
            <div key={info.id} className={`des_str ${index === 12 ? 'second' : ''}`}>
              {info.title}: {info.description}
            </div>
          )}
        </div>
    </div>
  );
};

export default ThingPage;