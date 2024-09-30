import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './ExpandableText.module.css';

const ExpandableText = ({ text, maxHeight }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflow, setIsOverflow] = useState(false);
    const textRef = useRef(null);

    useEffect(() => {
        const current = textRef.current;
        if (current) {
            setIsOverflow(current.scrollHeight > maxHeight);
        }
    }, [text, maxHeight]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={styles.container}>
            <div
                ref={textRef}
                className={`${styles.text} ${isExpanded ? styles.expanded : ''}`}
                style={{ maxHeight: isExpanded ? 'none' : `${maxHeight}px` }}
            >
                {text}
            </div>
            {isOverflow && (
                <button className={styles.toggleButton} onClick={toggleExpand}>
                    {isExpanded ? 'Скрыть отзыв' : 'Показать отзыв полностью'}
                </button>
            )}
        </div>
    );
};

ExpandableText.propTypes = {
    text: PropTypes.string.isRequired,
    maxHeight: PropTypes.number, // Максимальная высота в пикселях
};

ExpandableText.defaultProps = {
    maxHeight: 100, // По умолчанию 100px
};

export default ExpandableText;
