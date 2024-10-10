import React from 'react';
import { MdStar, MdStarBorder } from "react-icons/md";
import PropTypes from 'prop-types';
import styles from './StarRating.module.css'; 

const StarRating = ({ rating }) => {
  const totalStars = 5;
  const stars = [];

  for (let i = 1; i <= totalStars; i++) {
    if (i <= rating) {
      stars.push(<MdStar key={i} className={styles.star} />);
    } else {
      stars.push(<MdStarBorder key={i} className={styles.star} />);
    }
  }

  return <div className={styles.starRating}>{stars}</div>;
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

export default StarRating;
