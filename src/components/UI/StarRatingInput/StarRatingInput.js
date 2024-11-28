import React, { useState } from 'react';
import { MdStar } from "react-icons/md";
import PropTypes from 'prop-types';
import styles from './StarRatingInput.module.css';

const StarRatingInput = ({ value = 0, onChange }) => {
    const [hover, setHover] = useState(0);

    return (
        <div className={styles.starRating}>
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <label key={index}>
                        <input 
                            type="radio" 
                            name="rating" 
                            value={ratingValue}
                            onClick={() => onChange(ratingValue)}
                            style={{ display: 'none' }}
                        />
                        <MdStar
                            className={styles.star} 
                            color={ratingValue <= (hover || value) ? "#FFD700" : "#e4e5e9"} 
                            size={35}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(0)}
                            style={{ cursor: 'pointer' }}
                        />
                    </label>
                );
            })}
        </div>
    );
};

StarRatingInput.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
};

export default StarRatingInput;
