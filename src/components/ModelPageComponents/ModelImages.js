import React from 'react';
import { Image, Carousel, Skeleton } from 'antd';
import styles from './ModelPage.module.css';

const ModelImages = ({ images, loading }) => {
  return (
    <div className={styles.photo}>
      {loading ? (
        <div className={styles.photos}
            style={{ background: 'var(--card-background)', borderRadius: 'var(--main-border-radius) var(--main-border-radius) 0 0'  }}
        >
          <Skeleton.Image 
              active 
              style={{ width: '100%', height: '100%' }}
          />
        </div>
      ) : (
        <Carousel arrows className={styles.thing_carousel}>
          {images.map((image, index) => (
            <div key={index}>
              <Image
                className={styles.photos}
                src={process.env.REACT_APP_API_URL + image.img}
                alt={`Slide ${index + 1}`}
                width={'100%'}
              />
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default ModelImages;