import React from 'react';
import OnlyIcon from '../../icons/onlyfans.png';
import MymIcon from '../../icons/Mym.png';
import FanslyIcon from '../../icons/fansly.png';
import styles from './ModelPage.module.css';

const brandStyles = {
  1: { color: '#008ccf' },
  2: { color: '#1fa7df' },
  3: { color: '#e8642c' }
};

const brandIcons = {
  1: OnlyIcon,
  2: FanslyIcon,
  3: MymIcon
};

const ModelPlatforms = ({ adultPlatforms }) => {
  return (
    <div className={styles.brands}>
      <span>Platforms available:</span>
      <div className={styles.brands_icons_container}>
        {adultPlatforms && adultPlatforms.length > 0 ? (
          adultPlatforms.map(adultPlatform => (
            <div
              key={adultPlatform.id}
              style={brandStyles[adultPlatform.id] || { color: 'black' }}
              className={styles.brand_item}
            >
              {brandIcons[adultPlatform.id] && (
                <img
                  src={brandIcons[adultPlatform.id]}
                  alt={`${adultPlatform.name} icon`}
                  className={styles.brands_icons}
                />
              )}
            </div>
          ))
        ) : (
          <div>Unknown Brand</div>
        )}
      </div>
    </div>
  );
};

export default ModelPlatforms;