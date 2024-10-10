import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { FaRegCopy, FaCheck } from 'react-icons/fa';
import styles from './CopyableButton.module.css'; 

const CopyableButton = ({ value, className, style, ...props }) => {
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
  };

  return (
    <button
      onClick={handleCopy}
      className={`${styles.copyButton} ${className}`}
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

CopyableButton.defaultProps = {
  className: '',
  style: {},
};

export default CopyableButton;
