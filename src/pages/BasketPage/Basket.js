import React, { useEffect, useState, useContext } from 'react';
import styles from './Basket.module.css';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import TopicBack from '../../components/FuctionalComponents/TopicBack/TopicBack';
import { message, Button } from 'antd';
import ModelHelperCard from '../../components/MainComponents/ModelHelperCard/ModelHelperCard';
import LoadingIndicator from '../../components/UI/LoadingIndicator/LoadingIndicator';
import { ORDER_ROUTE } from '../../utils/consts';

const Basket = observer(() => {
    const { model, order } = useContext(Context);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        model.loadBasket();
    }, [model]);

    const handleRemove = async (basketItemId) => {
        setIsLoading(true);
        try {
            await model.removeFromBasket(basketItemId);
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
              }
        } catch (error) {
            message.error('Error when removing an item from the cart: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // В Basket.js
const handleBuyNow = async (modelProduct) => {
    setIsLoading(true);
    try {
        // Добавим логирование отправляемых данных
        console.log('Creating order with data:', {
            modelProductId: modelProduct.id,
            chatId: modelProduct.id
        });

        const newOrder = await order.createOrder({
            modelProductId: modelProduct.id,
            chatId: modelProduct.id,
        });

        if (newOrder?.id) {
            await model.removeFromBasket(modelProduct.basketItemId);
            
            navigate(`${ORDER_ROUTE}/${newOrder.id}`);
        }
    } catch (error) {
        console.error('Error payload:', error.response?.data);
        message.error('Error creating order: ' + (error.response?.data?.message || error.message));
    } finally {
        setIsLoading(false);
    }
};

    const handleClearBasket = async () => {
        setIsLoading(true);
        try {
            await model.clearBasket();
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
              }
        } catch (error) {
            message.error('Error when clearing the cart: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <div className="container">
            <TopicBack title="Your Favorites" />
            {model.basket.length > 0 ? (
            <div className="container-item">
                {model.basket.map(item => {
                    const modelProduct = item.modelProduct;
                    
                const additionalInfo = (
                    modelProduct.seller?.sellerInformation && (
                        <div className={styles.seller_info}>
                            <span>Seller: {modelProduct.seller.sellerInformation.sellerName}</span>
                        </div>
                    )
                );

                const actions = (
                    <>
                        <Button 
                            type='ghost' 
                            onClick={() => navigate(`/model/${modelProduct.modelId}`)}>
                            <span>Seller Chat</span>
                        </Button>
                        <Button 
                            type='primary' 
                            onClick={() => handleBuyNow(modelProduct)}
                            disabled={modelProduct.status !== 'AVAILABLE' || modelProduct.moderationStatus !== 'APPROVED'}>
                            Buy now
                        </Button>
                    </>
                );

                return (
                    <ModelHelperCard
                        key={modelProduct.id}
                        modelProduct={modelProduct}
                        additionalInfo={additionalInfo}
                        onDelete={() => handleRemove(item.id)}
                        actions={actions}
                        ribbonText={modelProduct.status !== 'AVAILABLE' || modelProduct.moderationStatus !== 'APPROVED' ? 'SOLD' : null}
                    />
                    );
                })}
                <div className='container-card'>
                    <div className='container-item'>
                        <Button 
                            danger 
                            onClick={handleClearBasket}
                            loading={isLoading}
                        >
                            Clear cart
                        </Button>
                    </div>
                </div>
            </div>
            ) : (
                <div className="no-info-container">Your Cart Is Empty</div>
            )}

        </div>
    );
});

export default Basket;
