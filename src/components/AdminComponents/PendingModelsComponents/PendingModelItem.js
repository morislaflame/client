// components/AdminComponents/PendingModelItem.js

import React from 'react';
import { useNavigate } from "react-router-dom";
import styles from '../AdminComponents.module.css'; // Создайте или используйте соответствующий файл стилей
import { THING_ROUTE } from "../../../utils/consts";
import MymIcon from '../../../icons/Mym.png';
import FanslyIcon from '../../../icons/fansly.png';
import OnlyIcon from '../../../icons/onlyfans.png';
import Placeholder from '../../../icons/placeholder.jpg';
import { Modal, Select, message, Popconfirm } from 'antd';
import { useState } from 'react';

const { Option } = Select;

const PendingModelItem = ({ model, onApprove, onReject }) => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);

  const previewImage = model.images && model.images.length > 0 ? model.images[0].img : Placeholder;

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

  const rejectionReasons = ["REASON1", "REASON2", "REASON3"]; // Замените на реальные причины

  const showRejectModal = () => {
    setIsModalVisible(true);
  };

  const handleReject = () => {
    if (selectedReason) {
      onReject(model.id, selectedReason);
      setIsModalVisible(false);
      setSelectedReason(null);
    } else {
      message.warning("Please select a rejection reason");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedReason(null);
  };

  const handleApproveConfirm = () => {
    onApprove(model.id);
    message.success(`Model ${model.name} has been approved`);
  };

  return (
    <div className='card_list'>
      <div className={styles.seller_card}>
        <div className={styles.seller_card_image_wrapper} onClick={() => navigate(THING_ROUTE + "/" + model.id)}>
          <img src={process.env.REACT_APP_API_URL + previewImage} alt={model.name} className={styles.seller_card_image} />
        </div>
        <div className={styles.seller_card_content}>
          <div className={styles.brand_name} onClick={() => navigate(THING_ROUTE + "/" + model.id)}>
            <div className={styles.seller_card_brands}>
              {model.adultPlatforms && model.adultPlatforms.length > 0 ? (
                model.adultPlatforms.map((brand) => (
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
              <span className={styles.seller_card_title}>{model.name}</span>
              <span className={styles.seller_card_price}>${model.priceUSD}</span>
            </div>
          </div>
          <div className={styles.action_buttons}>
            <Popconfirm
              title="Approve Model"
              description={`Are you sure you want to approve model ${model.name}?`}
              onConfirm={handleApproveConfirm}
              okText="Yes"
              cancelText="No"
              placement="topRight"
            >
              <button className={styles.approve_button}>
                Approve
              </button>
            </Popconfirm>
            <button className={styles.reject_button} onClick={showRejectModal}>
              Reject
            </button>
          </div>
        </div>
      </div>

      {/* Модальное окно для ввода причины отклонения */}
      <Modal
        title="Reject Model"
        open={isModalVisible}
        onOk={handleReject}
        onCancel={handleCancel}
      >
        <p>Please select a rejection reason:</p>
        <Select
          style={{ width: '100%' }}
          placeholder="Select a reason"
          onChange={(value) => setSelectedReason(value)}
        >
          {rejectionReasons.map((reason) => (
            <Option key={reason} value={reason}>
              {reason}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default PendingModelItem;
