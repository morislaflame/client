import React from 'react';
import { Button, Flex } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SHOP_ROUTE } from '../../utils/consts';
import styles from './BackButton.module.css';
import { HiArrowLongLeft } from "react-icons/hi2";


export default function BackButton() {
    const navigate = useNavigate();

    const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(SHOP_ROUTE);
    }
  };

  return (
    <Button type="text" className={styles.backbutton} onClick={handleBackClick}>
            <HiArrowLongLeft />Back
    </Button>
  )
}
