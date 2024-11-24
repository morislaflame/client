import React from 'react';
import { Button, Flex } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SHOP_ROUTE } from '../../utils/consts';
import styles from './BackButtons.module.css';
import { IoArrowBackCircleSharp } from "react-icons/io5";


export default function BackButtons() {
    const navigate = useNavigate();

    const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(SHOP_ROUTE);
    }
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
  };

  return (
    <Button type="text" className={styles.backbutton} onClick={handleBackClick}>
            <IoArrowBackCircleSharp />
    </Button>
  )
}
