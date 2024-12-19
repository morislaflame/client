import React from 'react';
import styles from './OrderComponents.module.css';
import { useNavigate } from 'react-router-dom';
import Placeholder from '../../icons/placeholder.jpg';
import OnlyIcon from '../../icons/onlyfans.png';
import FanslyIcon from '../../icons/fansly.png';
import MymIcon from '../../icons/Mym.png';
import { THING_ROUTE } from '../../utils/consts';
import { useLayoutEffect } from 'react';
import { UpAnimation } from '../Animations/UpAnimation';

const OrderModel = ({ modelProduct }) => {

    const navigate = useNavigate();

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

    useLayoutEffect(() => {
        UpAnimation('#order-model');
    }, []);

  return (
    <div className='container-item' id='order-model'>
            <div className={styles.productCard} onClick={() => navigate(THING_ROUTE + "/" + modelProduct.id)}>
                    <>
                        {modelProduct.images && modelProduct.images[0] && (
                            <img 
                                src={process.env.REACT_APP_API_URL + modelProduct.images[0].img}
                                alt={modelProduct.name}
                                className={styles.productImage}
                            />
                        )}
                        <div className={styles.productInfo}>
                            <div className="descript">
                                {modelProduct.adultPlatforms && modelProduct.adultPlatforms.length > 0 ? (
                                    modelProduct.adultPlatforms.map(adultPlatform => (
                                        <div 
                                            key={adultPlatform.id} 
                                            style={brandStyles[adultPlatform.id] || { color: 'black' }}  
                                            className="brand-item"
                                        >
                                            {brandIcons[adultPlatform.id] && (
                                                <img 
                                                    src={brandIcons[adultPlatform.id]} 
                                                    alt={`${adultPlatform.name} icon`} 
                                                    className="brand-icon"
                                                />
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div>Unknown Brand</div>
                                )}
                            </div>
                            <div className="thing-all">
                                <div className="thingName">
                                    {modelProduct.name}
                                </div>
                                <div className="thing-info">
                                    <div><b>Content:</b> {modelProduct.info && modelProduct.info.content ? modelProduct.info.content : 'N/A'}</div>
                                    <div><b>OF Verified:</b> {modelProduct.info && modelProduct.info.ofverif ? modelProduct.info.ofverif : 'N/A'}</div>
                                </div>
                                <div className="thing-price">
                                    ${modelProduct.priceUSD}
                                </div>
                            </div>
                        </div>
                    </>
            </div>
        </div>
  );
};

export default OrderModel;
