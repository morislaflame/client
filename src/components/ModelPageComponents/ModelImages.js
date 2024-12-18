import React from 'react';
import { Image, Carousel } from 'antd';
import styles from './ModelPage.module.css';

const ModelImages = ({ images }) => {
  return (
    <div className={styles.photo}>
      <Carousel arrows className={styles.thing_carousel}>
        {images.map((image, index) => (
          <div key={index}>
            <Image
              className={styles.photos}
              src={process.env.REACT_APP_API_URL + image.img}
              alt={`Slide ${index + 1}`}
              placeholder={<Image.PreviewGroup />}
              width={'100%'}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ModelImages;