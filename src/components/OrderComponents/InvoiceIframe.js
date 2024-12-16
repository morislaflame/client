// client/src/components/InvoiceIframe/InvoiceIframe.js
// В InvoiceIframe.js
import React, { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import LoadingIndicator from '../UI/LoadingIndicator/LoadingIndicator';
import styles from './OrderComponents.module.css';

const InvoiceIframe = ({ isVisible, onClose, invoiceUrl }) => {
    const [isLoading, setIsLoading] = useState(true);

    if (!isVisible) return null;

    return (
        <div className={styles.fullscreenIframe}>
            <button 
                className={styles.closeButton} 
                onClick={onClose}
            >
                <CloseOutlined />
            </button>
            
            {isLoading && (
                <div className={styles.iframeLoader}>
                    <LoadingIndicator />
                </div>
            )}
            
            <iframe
                src={invoiceUrl}
                className={styles.iframeContent}
                title="Payment Frame"
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
};

export default InvoiceIframe;