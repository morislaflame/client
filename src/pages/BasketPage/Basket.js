import React, { useEffect, useState, useContext } from 'react';
import styles from './Basket.module.css';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import TopicBack from '../../components/FuctionalComponents/TopicBack/TopicBack';
import { message, Spin, Button } from 'antd';
import { LoadingOutlined } from "@ant-design/icons";
import ModelHelperCard from '../../components/MainComponents/ModelHelperCard/ModelHelperCard';

const Basket = observer(() => {
    const { model } = useContext(Context);
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
        return <Spin indicator={<LoadingOutlined style={{color: 'white'}} spin />} />;
    }

    if (model.basket.length === 0) {
        return <div className={styles.basket_empty}>Your Cart Is Empty</div>;
    }

    return (
        <div className="container">
            <TopicBack title="Your Favorites" />
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
                            onClick={() => navigate(`/model/${modelProduct.modelId}`)}>
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
                <button className={styles.clear_basket} onClick={handleClearBasket}>Clear cart</button>
            </div>

        </div>
    );
});

export default Basket;
