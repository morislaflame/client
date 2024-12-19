import React from 'react';
import { Button } from 'antd';
import styles from './OrderComponents.module.css';
import { UpAnimation } from '../Animations/UpAnimation';
import { useLayoutEffect } from 'react';

const OrderTotal = ({ totalPriceUSD, onPayment, isLoadingInvoice }) => {
    useLayoutEffect(() => {
        UpAnimation('#order-total');
    }, []);

    return (
        <div className={styles.orderTotalContainer} id='order-total'>
            <div className={styles.orderTotal}>
                <h3>Total: ${totalPriceUSD}</h3>
                <Button
                    onClick={() => {
                      if (window.Telegram?.WebApp?.HapticFeedback) {
                        window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
                      }
                      onPayment()
                    }}
                    type="ghost"
                    loading={isLoadingInvoice}
                >
                    Create Invoice
                </Button>
            </div>
        </div>
    );
};

export default OrderTotal;