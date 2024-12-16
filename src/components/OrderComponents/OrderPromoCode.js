import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Input, Button, message, Card } from 'antd';
import { Context } from '../../index';
import { useContext } from 'react';
import styles from './OrderComponents.module.css';

const OrderPromoCode = observer(({ orderId }) => {
    const { order } = useContext(Context);
    const [promoCode, setPromoCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        order.loadMyPromoCodes();
    }, []);

    const handleApplyPromoCode = async (code) => {
        if (!code.trim()) {
            message.warning('Enter promocode');
            return;
        }

        setIsLoading(true);
        try {
            await order.applyPromoCode(orderId, code);
            message.success('Promocode successfully applied');
            setPromoCode('');
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Error applying promocode');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemovePromoCode = async () => {
        setIsLoading(true);
        try {
            await order.removePromoCode(orderId);
            message.success('Promocode successfully removed');
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Error removing promocode');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDiscount = (value, type) => {
        return type === 'PERCENTAGE' ? `${value}%` : `$${value}`;
    };

    const currentOrder = order.currentOrder;
    const hasAppliedPromoCode = currentOrder?.promoCodeId;
    const discountAmount = currentOrder?.discountAmountUSD || 0;

    return (
        <div className='container-card'>
            <div className='container-item'>
                <h3>Promocode</h3>
                <div className='container-item'>
                    {hasAppliedPromoCode ? (
                        <div className='container-item'>
                            <div className={styles.discountInfo}>
                            <span>Applied discount:</span>
                            <span className={styles.discountAmount}>${discountAmount}</span>
                        </div>
                        <Button 
                            onClick={handleRemovePromoCode} 
                            loading={isLoading}
                            danger
                        >
                            Remove promocode
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className={styles.promoCodeInput}>
                            <Input
                                placeholder="Enter promocode"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                disabled={isLoading}
                            />
                            <Button 
                                type="primary" 
                                onClick={() => handleApplyPromoCode(promoCode)}
                                loading={isLoading}
                            >
                                Apply
                            </Button>
                        </div>
                        
                        {order.availablePromoCodes.length > 0 && (
                            <div className='container-item'>
                                <h4>Available promocodes:</h4>
                                <div className={styles.promoCodesList}>
                                    {order.availablePromoCodes.map((promo) => (
                                        <Button 
                                            key={promo.id} 
                                            className={styles.promoCard}
                                            onClick={() => handleApplyPromoCode(promo.code)}
                                        >
                                            <div className={styles.promoInfo}>
                                                <span className={styles.promoCode}>({promo.code})</span>
                                                <span className={styles.promoDiscount}>
                                                    Discount: {formatDiscount(promo.discountValue, promo.discountType)}
                                                </span>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
                </div>
            </div>
        </div>
    );
});

export default OrderPromoCode;
