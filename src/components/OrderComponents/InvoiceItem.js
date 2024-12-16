// client/src/components/OrderComponents/InvoiceItem.js
import React from 'react';
import { Button } from 'antd';
import styles from './OrderComponents.module.css';
import OrderTags from '../UI/OrderTags/OrderTags';
import FormatDate from '../UI/FormatDate/FormatDate';
import { useContext } from 'react';
import { Context } from '../../index';

const InvoiceItem = ({ invoice, setIsInvoiceVisible }) => {
    const { order } = useContext(Context);

    const handleContinuePayment = () => {
        if (invoice.link) {
            order.setCurrentInvoice(invoice);
            order.setIsInvoiceVisible(true);
        }
    };

    return (
        <div className='container-card'>
            <div className={styles.invoiceInfo}>
                <div className={styles.invoiceHeader}>
                    <h4>Invoice #{invoice.id}</h4>
                    <OrderTags status={invoice.status} />
                </div>
                
                <div className={styles.invoiceDetails}>
                    <div className={styles.invoiceAmount}>
                        <span>$ {invoice.amountUSD.toFixed(2)}</span>
                        {invoice.received > 0 && (
                            <span>Received: {invoice.received.toFixed(2)} {invoice.currency}</span>
                        )}
                    </div>
                    <div className={styles.invoiceDates}>
                        <FormatDate date={invoice.createdAt} />
                        {invoice.status === 'COMPLETED' && (
                            <span>Completed: <FormatDate date={invoice.updatedAt} /></span>
                        )}
                    </div>
                </div>
            </div>

            {invoice.status === 'CREATED' && (
                <Button 
                    type="primary"
                    onClick={handleContinuePayment}
                    className={styles.continuePaymentButton}
                >
                    Continue Payment
                </Button>
            )}
        </div>
    );
};

export default InvoiceItem;