import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { FaRegCopy, FaCheck } from 'react-icons/fa';
import styles from './CopyableButton.module.css'; 

const CopyableButton = ({ 
  value, 
  className = '', // Значение по умолчанию
  style = {},     // Значение по умолчанию
  ...props 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) {
      message.error('No value to copy');
      return;
    }

    navigator.clipboard.writeText(value)
      .then(() => {
        setCopied(true);
        message.success('Copied!');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Copy error:', err);
        message.error('Failed to copy');
      });
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
      }
  };

  return (
    <button
      onClick={handleCopy}
      className={`${styles.copyButton} ${className}`}
      style={style} // Применение стилей
      {...props}
    >
      {copied ? <FaCheck /> : <FaRegCopy />}
      <span className={styles.valueText}>{value}</span>
    </button>
  );
};

CopyableButton.propTypes = {
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};


export default CopyableButton;
