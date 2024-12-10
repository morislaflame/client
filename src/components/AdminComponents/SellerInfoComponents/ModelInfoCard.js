import React from 'react';
import { useNavigate } from "react-router-dom";
import styles from './SellerInfoComponents.module.css';
import { THING_ROUTE } from "../../../utils/consts";
import MymIcon from '../../../icons/Mym.png';
import FanslyIcon from '../../../icons/fansly.png';
import OnlyIcon from '../../../icons/onlyfans.png';
import Placeholder from '../../../icons/placeholder.jpg';
import { Tag } from 'antd';

const ModelInfoCard = ({ thing }) => {
    const navigate = useNavigate();

    const previewImage = thing.images && thing.images.length > 0 
        ? thing.images[0].img 
        : Placeholder;

    const brandStyles = {
        1: { color: '#008ccf' },
        2: { color: '#1fa7df' },
        3: { color: '#e8642c' },
    };

    const brandIcons = {
        1: OnlyIcon,
        2: FanslyIcon,
        3: MymIcon,
    };

    const statusColors = {
        'APPROVED': 'green',
        'PENDING': 'blue',
        'REJECTED': 'red',
    };

    return (
        <div className={styles.card_list}>
            <div className={styles.model_card}>
                <div 
                    className={styles.model_card_image_wrapper} 
                    onClick={() => navigate(THING_ROUTE + "/" + thing.id)}
                >
                    <img 
                        src={process.env.REACT_APP_API_URL + previewImage} 
                        alt={thing.name} 
                        className={styles.model_card_image} 
                    />
                </div>
                <div className={styles.model_card_content}>
                    <div 
                        className={styles.brand_name} 
                        onClick={() => navigate(THING_ROUTE + "/" + thing.id)}
                    >
                        <div className={styles.model_card_brands}>
                            {thing.adultPlatforms && thing.adultPlatforms.length > 0 ? (
                                thing.adultPlatforms.map((brand) => (
                                    <div
                                        key={brand.id}
                                        style={brandStyles[brand.id] || { color: 'black' }}
                                        className={styles.model_brand_item}
                                    >
                                        {brandIcons[brand.id] && (
                                            <img
                                                src={brandIcons[brand.id]}
                                                alt={`${brand.name} icon`}
                                                className={styles.model_brand_icon}
                                            />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div>Unknown Brand</div>
                            )}
                        </div>
                        <div className={styles.model_card_header}>
                            <span className={styles.model_card_title}>{thing.name}</span>
                            <span className={styles.model_card_price}>${thing.priceUSD}</span>
                        </div>
                    </div>
                    <div className={styles.moderation_status}>
                        <span>Moderation:</span>
                        <Tag color={statusColors[thing.moderationStatus]}>
                            {thing.moderationStatus}
                        </Tag>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelInfoCard;
