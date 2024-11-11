import React from 'react';
import { useNavigate } from "react-router-dom";
import styles from './SellerComponents.module.css';
import { THING_ROUTE } from "../../utils/consts";
import MymIcon from '../../icons/Mym.png';
import FanslyIcon from '../../icons/fansly.png';
import OnlyIcon from '../../icons/onlyfans.png';
import Placeholder from '../../icons/placeholder.jpg';
import { Tag, Popconfirm } from 'antd';

const SellerThingItem = ({ thing, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const previewImage = thing.images && thing.images.length > 0 ? thing.images[0].img : Placeholder;

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

  // Отображение цвета статуса модерации
  const statusColors = {
    'approved': 'green',
    'pending': 'blue',
    'rejected': 'red',
  };

  return (
    <div className={styles.card_list}>
      <div className={styles.seller_card}>
        <div className={styles.seller_card_image_wrapper} onClick={() => navigate(THING_ROUTE + "/" + thing.id)}>
          <img src={process.env.REACT_APP_API_URL + previewImage} alt={thing.name} className={styles.seller_card_image} />
        </div>
        <div className={styles.seller_card_content}>
          <div className={styles.brand_name}>
            <div className={styles.seller_card_brands}>
              {thing.brands && thing.brands.length > 0 ? (
                thing.brands.map((brand) => (
                  <div
                    key={brand.id}
                    style={brandStyles[brand.id] || { color: 'black' }}
                    className={styles.seller_brand_item}
                  >
                    {brandIcons[brand.id] && (
                      <img
                        src={brandIcons[brand.id]}
                        alt={`${brand.name} icon`}
                        className={styles.seller_brand_icon}
                      />
                    )}
                  </div>
                ))
              ) : (
                <div>Unknown Brand</div>
              )}
            </div>
            <div className={styles.seller_card_header}>
              <span className={styles.seller_card_title}>{thing.name}</span>
              <span className={styles.seller_card_price}>${thing.price}</span>
            </div>
          </div>
          <div className={styles.moderation_status}>
            <span>Moderation:</span>
            <Tag color={statusColors[thing.moderationStatus]}>{thing.moderationStatus}</Tag>
          </div>
          <div className={styles.action_buttons}>
            <button className={styles.edit_button} onClick={() => onEdit(thing)}>
              Edit  
            </button>
            <Popconfirm
              title="Are you sure you want to delete this model?"
              onConfirm={() => onDelete(thing)}
              okText="Yes"
              cancelText="No"
            >
              <button className={styles.delete_button} type="button">
                Delete
              </button>
            </Popconfirm>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerThingItem;
