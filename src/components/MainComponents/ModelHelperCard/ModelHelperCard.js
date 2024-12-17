import React from 'react';
import styles from './ModelHelperCard.module.css';
import { Badge, Button } from 'antd';
import { RxCross2 } from "react-icons/rx";
import MymIcon from '../../../icons/Mym.png';
import FanslyIcon from '../../../icons/fansly.png';
import OnlyIcon from '../../../icons/onlyfans.png';
import Placeholder from '../../UI/Placeholder/Placeholder';

const ModelHelperCard = ({ 
    modelProduct, 
    additionalInfo,
    onDelete,
    showDelete = true,
    actions,
    ribbonText
}) => {
    // Brand styles and icons
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

    const cardContent = (
        <div className={styles.basket_item}>
            <div className={styles.item_inner}>
                {showDelete && (
                    <button
                        onClick={onDelete}
                        className={styles.delete}
                    >
                        <RxCross2 />
                    </button>
                )}
                <div className={styles.img}>
                    {modelProduct.images && modelProduct.images.length > 0 ? (
                        <img 
                            src={process.env.REACT_APP_API_URL + modelProduct.images[0].img} 
                            alt={modelProduct.name} 
                            className={styles.basket_item_img} 
                        />
                    ) : (
                        <Placeholder className={styles.basket_item_img} />
                    )}
                </div>
                
                <div className={styles.item_info}>
                    <div className={styles.model_info}>
                        <div className={styles.brands_basket}>
                            {modelProduct.adultPlatforms && modelProduct.adultPlatforms.length > 0 ? (
                                modelProduct.adultPlatforms.map(adultPlatform => (
                                    <div
                                        key={adultPlatform.id}
                                        style={brandStyles[adultPlatform.id] || { color: 'black' }}
                                        className={styles.brand_item_basket}
                                    >
                                        {brandIcons[adultPlatform.id] && (
                                            <img
                                                src={brandIcons[adultPlatform.id]}
                                                alt={`${adultPlatform.name} icon`}
                                                className={styles.brands_icons_basket}
                                            />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div>Unknown Brand</div>
                            )}
                        </div>
                        <h5 className={styles.basket_item_name}>
                            {modelProduct.name} - ${modelProduct.priceUSD}
                        </h5>
                    </div>
                    {additionalInfo}
                    {actions && (
                        <div className={styles.model_actions}>
                            {actions}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return ribbonText ? (
        <Badge.Ribbon text={ribbonText} color="red">
            {cardContent}
        </Badge.Ribbon>
    ) : cardContent;
};

export default ModelHelperCard;
