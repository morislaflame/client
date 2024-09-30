// src/components/StarRating/StarRating.jsx
import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import PropTypes from 'prop-types';
import styles from './StarRating.module.css'; // Создадим CSS модуль для стилизации

const StarRating = ({ rating }) => {
  const totalStars = 5;
  const stars = [];

  for (let i = 1; i <= totalStars; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} className={styles.star} />);
    } else {
      stars.push(<FaRegStar key={i} className={styles.star} />);
    }
  }

  return <div className={styles.starRating}>{stars}</div>;
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

export default StarRating;
