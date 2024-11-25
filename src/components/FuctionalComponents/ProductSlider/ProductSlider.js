import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Skeleton } from 'antd';
import { fetchThings } from '../../../http/NonUsedAPI/thingAPI';
import './ProductSlider.css';

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThings()
      .then(data => {
        setProducts(data.rows);
      })
      .finally(() => {
        setLoading(false);
      });
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

  const skeletonCount = settings.slidesToShow;

  return (
    <div className='slider'>
      {loading ? (
        <Slider {...settings}>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <div key={index} className="product-card">
              <Skeleton.Image style={{ width: '100%', height: '200px' }} active />
              <Skeleton active paragraph={{ rows: 1, width: '80%' }} />
            </div>
          ))}
        </Slider>
      ) : (
        <Slider {...settings}>
          {products.map(product => {
            const imageUrl = product.images?.[0]?.img
              ? `${process.env.REACT_APP_API_URL}${product.images[0].img}`
              : 'placeholder.jpg';
            return (
              <div key={product.id} className="product-card">
                <img src={imageUrl} alt={product.name} />
                <p>{product.name}</p>
              </div>
            );
          })}
        </Slider>
      )}
    </div>
  );
};

export default ProductSlider;
