import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { fetchThings } from '../../http/thingAPI';
import './ProductSlider.css';

const ProductSlider = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchThings().then(data => setProducts(data.rows));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  return (
    <Slider {...settings} className='slider'>
      {products.map(product => (
        <div key={product.id} className="product-card">
          <img 
            src={`${process.env.REACT_APP_API_URL}${product.images?.[0]?.img || 'placeholder.jpg'}`} 
            alt={product.name} 
          />
          <p>{product.name}</p>
        </div>
      ))}
    </Slider>
  );
};

export default ProductSlider;