import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './ExpandableText.module.css';

const ExpandableText = ({ text, maxHeight = 100 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflow, setIsOverflow] = useState(false);
    const [height, setHeight] = useState(0);
    const textRef = useRef(null);

    useEffect(() => {
        const current = textRef.current;
        if (current) {
            // Measure the full height of the content
            const fullHeight = current.scrollHeight;
            setHeight(fullHeight);

            // Determine if the content overflows the maxHeight
            setIsOverflow(fullHeight > maxHeight);
        }
    }, [text, maxHeight]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={styles.container}>
            <div
                ref={textRef}
                className={styles.text}
                style={{
                    maxHeight: isExpanded ? `${height}px` : `${maxHeight}px`,
                }}
            >
                {text}
            </div>
            {isOverflow && (
                <button
                    className={styles.toggleButton}
                    onClick={toggleExpand}
                    aria-expanded={isExpanded}
                >
                    {isExpanded ? 'Hide review' : 'Show full review'}
                </button>
            )}
        </div>
    );
};

ExpandableText.propTypes = {
    text: PropTypes.string.isRequired,
    maxHeight: PropTypes.number,
};

export default ExpandableText;
