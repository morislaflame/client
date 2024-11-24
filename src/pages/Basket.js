import React, { useEffect, useState, useContext } from 'react';
import styles from './Basket.module.css';
import { useNavigate } from 'react-router-dom';
import { Context } from '../index';
import MyButton from '../components/UI/MyButton/MyButton';
import MymIcon from '../icons/Mym.png';
import FanslyIcon from '../icons/fansly.png';
import OnlyIcon from '../icons/onlyfans.png';
import { observer } from 'mobx-react-lite';
import BackButton from '../components/UI/BackButton/BackButton';
import { message, Badge, Spin } from 'antd';
import { CgCloseO } from "react-icons/cg";
import { LoadingOutlined } from "@ant-design/icons";

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

    // const handleApplyPromoCode = async (promoCode) => {
    //     const promoCodeToApply = promoCode || promoCodeInput;
    //     if (!promoCodeToApply) {
    //         message.error('Please enter the promocode');
    //         return;
    //     }
    //     if (window.Telegram?.WebApp?.HapticFeedback) {
    //         window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    //       }
    //     setIsApplyingPromo(true); // Устанавливаем состояние загрузки в true
    //     const result = await thing.applyPromoCode(promoCodeToApply);
    //     setIsApplyingPromo(false); // Устанавливаем состояние загрузки в false после завершения

    //     if (!result.success) {
    //         message.error(result.message || 'Error when applying promocode');
    //     } else {
    //         setAppliedPromoCode(promoCodeToApply);
    //         setPromoCodeInput('');
    //     }
    // };

    // const handleRemovePromoCode = async () => {
    //     await thing.removePromoCode();
    //     if (window.Telegram?.WebApp?.HapticFeedback) {
    //         window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    //       }
    //     setAppliedPromoCode('');
    // };

    // const handlePayment = () => {
    //     const unavailableItems = thing.basket.filter(item => item.status !== 'available');
    //     if (unavailableItems.length > 0) {
    //         message.error('Some items are not available for payment. Please remove them from your cart.');
    //         return;
    //     }
    //     if (window.Telegram?.WebApp?.HapticFeedback) {
    //         window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    //       }
    //     navigate('/payment', { state: { totalAmount: thing.totalPrice } });
    // };
    

    if (model.basket.length === 0) {
        return <div className={styles.basket_empty}>Your Cart Is Empty</div>;
    }

    // Brand styles and icons
    const brandStyles = {
        1: { color: '#008ccf' },
        2: { color: '#1fa7df' },
        3: { color: '#e8642c' }
    };

    const brandIcons = {
        1: OnlyIcon,
        2: FanslyIcon,
        3: MymIcon
    };

    return (
        <div className={styles.basket_page}>
            
            <div className={styles.topic_back}><BackButton/><h2>Your cart</h2></div>
            <div className={styles.basket_items}>
                {model.basket.map(item => {
                    const modelProduct = item.modelProduct;
                    const basketItemContent = (
                        <div className={styles.basket_item}>
                            <div className={styles.item_inner}>
                                <div className={styles.img_brands}>
                                    {modelProduct.images && modelProduct.images.length > 0 ? (
                                        <img src={process.env.REACT_APP_API_URL + modelProduct.images[0].img} alt={modelProduct.name} className={styles.basket_item_img} />
                                    ) : (
                                        <img src="/path/to/default/image.png" alt="Нет изображения" className={styles.basket_item_img} />
                                    )}
                                </div>
                                
                                <div className={styles.basket_item_info}>
                                    <div className={styles.info_brand}>
                                        <div className={styles.items_name_price}>
                                            <div className={styles.brands_basket}>
                                                {modelProduct.adultPlatforms && modelProduct.adultPlatforms.length > 0 ? (
                                                    modelProduct.adultPlatforms.map(adultPlatform => (
                                                        <div
                                                            key={adultPlatform.id}
                                                            style={brandStyles[adultPlatform.id] || { color: 'black' }}
                                                            className={styles.brand_item_basket}
                                                        >
                                                            {brandIcons[adultPlatform.id] && (
                                                                <img
                                                                    src={brandIcons[adultPlatform.id]}
                                                                    alt={`${adultPlatform.name} icon`}
                                                                    className={styles.brands_icons_basket}
                                                                />
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div>Unknown Brand</div>
                                                )}
                                            </div>
                                            <span className={styles.basket_item_name}>{item.name}</span>
                                            <div className={styles.thing_info}>
                                                <span className={styles.info}>Start: {modelProduct.info.start}</span>
                                                <span className={styles.info}>Content: {modelProduct.info.content}</span>
                                            </div>
                                            {modelProduct.originalPrice && modelProduct.priceUSD !== modelProduct.originalPrice && (
                                                <span className={styles.basket_item_original_price} style={{ textDecoration: 'line-through', color: 'grey' }}>
                                                    ${modelProduct.originalPrice}
                                                </span>
                                            )}
                                            <span className={styles.basket_item_price}>${modelProduct.priceUSD}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div onClick={() => handleRemove(item.id)} style={{
                                height: 'calc(var(--index)* 17)',
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                <CgCloseO className={styles.basket_item_remove}/>
                            </div>
                        </div>
                    );

                    return modelProduct.status !== 'AVAILABLE' ? (
                        <Badge.Ribbon
                            key={modelProduct.id}
                            text="SOLD"
                            color='red'
                        >
                            {basketItemContent}
                        </Badge.Ribbon>
                    ) : (
                        <React.Fragment key={modelProduct.id}>
                            {basketItemContent}
                        </React.Fragment>
                    );
                })}
                <button className={styles.clear_basket} onClick={handleClearBasket}>Clear cart</button>
            </div>

            {/* <div className={styles.promo_code_section}>
                <div className={styles.promocodes}>
                    <h3>Apply Promocode</h3>
                    {appliedPromoCode || thing.promoCode ? (
                        <div className={styles.applied_promocode}>
                            <p>Promocode: {appliedPromoCode || thing.promoCode.code}</p>
                            <button onClick={handleRemovePromoCode}>Remove</button>
                        </div>
                    ) : (
                        <>
                            <input
                                type="text"
                                value={promoCodeInput}
                                onChange={(e) => setPromoCodeInput(e.target.value)}
                                placeholder="Enter promo code"
                                className={styles.apply_promo_input}
                            />
                            <button onClick={() => handleApplyPromoCode()} disabled={isApplyingPromo}>
                                {isApplyingPromo ? <Spin indicator={<LoadingOutlined style={{color: 'white'}} spin />} /> : 'Apply'}
                            </button>
                        </>
                    )}
                </div>

                <div className={styles.user_promocodes}>
                    {thing.userPromoCodes.length > 0 ? (
                        <div>
                            <h3>Your Promocodes:</h3>
                            <div className={styles.user_promocodes_list}>
                                {thing.userPromoCodes.map(promo => (
                                    <button
                                        key={promo.id}
                                        onClick={() => handleApplyPromoCode(promo.code)}
                                        className={styles.user_promocode_item}
                                        disabled={appliedPromoCode === promo.code || isApplyingPromo}
                                    >
                                        {isApplyingPromo && appliedPromoCode !== promo.code ? <Spin indicator={<LoadingOutlined style={{color: 'white'}} spin />} /> : (appliedPromoCode === promo.code ? `${promo.code} applied` : `${promo.code} ${promo.isPercentage ? promo.discountValue + '%' : '$' + promo.discountValue}`)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p></p>
                    )}
                </div>
            </div> */}
            

            {/* <div className={styles.basket_total}>
                <h3>Total amount: ${model.modelProduct.priceUSD}</h3>
                {model.discount > 0 && <p>Discount: ${model.discount}</p>}
                <MyButton 
                    style={{width: 'calc(var(--index)* 25)'}}
                    text={'Go to payment'} 
                    onClick={""}
                ></MyButton>
            </div> */}
        </div>
    );
});

export default Basket;
