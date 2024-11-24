import React, { useState } from 'react';
import { MdStar } from "react-icons/md";
import PropTypes from 'prop-types';
import styles from './StarRatingInput.module.css';

const StarRatingInput = ({ rating, setRating }) => {
    const [hover, setHover] = useState(0);

    return (
        <div className={styles.starRating}>
            {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                    <label key={index}>
                        <input 
                            type="radio" 
                            name="rating" 
                            value={ratingValue}
                            onClick={() => setRating(ratingValue)}
                            style={{ display: 'none' }}
                        />
                        <MdStar
                            className={styles.star} 
                            color={ratingValue <= (hover || rating) ? "#FFD700" : "#e4e5e9"} 
                            size={35}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(0)}
                        />
                    </label>
                );
            })}
        </div>
    );
};

StarRatingInput.propTypes = {
    rating: PropTypes.number.isRequired,
    setRating: PropTypes.func.isRequired,
};

export default StarRatingInput;
