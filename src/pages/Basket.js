import React, { useEffect, useState, useContext } from 'react';
import styles from './Basket.module.css';
import { useNavigate } from 'react-router-dom';
import { Context } from '../index';
import MyButton from '../components/MyButton/MyButton';
import MymIcon from '../icons/Mym.png';
import FanslyIcon from '../icons/fansly.png';
import OnlyIcon from '../icons/onlyfans.png';
import { observer } from 'mobx-react-lite';
import BackButton from '../components/BackButton/BackButton';
import { message, Badge } from 'antd';
import { CgCloseO } from "react-icons/cg";

const Basket = observer(() => {
    const { thing } = useContext(Context);
    const navigate = useNavigate();
    const [promoCodeInput, setPromoCodeInput] = useState('');
    const [appliedPromoCode, setAppliedPromoCode] = useState('');

    useEffect(() => {
        thing.loadBasket();
        thing.loadUserPromoCodes();
    }, [thing]);

    const handleRemove = async (thingId) => {
        try {
            await thing.removeFromBasket(thingId);
        } catch (error) {
            message.error('Error when removing an item from the cart: ' + error.message);
        }
    };

    const handleClearBasket = async () => {
        try {
            await thing.clearBasket();
        } catch (error) {
            message.error('Error when clearing the cart: ' + error.message);
        }
    };

    const handleApplyPromoCode = async (promoCode) => {
        const promoCodeToApply = promoCode || promoCodeInput;
        if (!promoCodeToApply) {
            message.error('Please enter the promocode');
            return;
        }

        const result = await thing.applyPromoCode(promoCodeToApply);
        if (!result.success) {
            message.error(result.message || 'Error when applying promocode');
        } else {
            setAppliedPromoCode(promoCodeToApply);
            setPromoCodeInput('');
        }
    };

    const handleRemovePromoCode = async () => {
        await thing.removePromoCode();
        setAppliedPromoCode('');
    };

    const handlePayment = () => {
        const unavailableItems = thing.basket.filter(item => item.status !== 'available');
        if (unavailableItems.length > 0) {
            message.error('Some items are not available for payment. Please remove them from your cart.');
            return;
        }
        navigate('/payment', { state: { totalAmount: thing.totalPrice } });
    };
    

    if (thing.basket.length === 0) {
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
                {thing.basket.map(item => {
                    const basketItemContent = (
                        <div className={styles.basket_item}>
                            <div className={styles.item_inner}>
                                <div className={styles.img_brands}>
                                    {item.images && item.images.length > 0 ? (
                                        <img src={process.env.REACT_APP_API_URL + item.images[0].img} alt={item.name} className={styles.basket_item_img} />
                                    ) : (
                                        <img src="/path/to/default/image.png" alt="Нет изображения" className={styles.basket_item_img} />
                                    )}
                                </div>
                                
                                <div className={styles.basket_item_info}>
                                    <div className={styles.info_brand}>
                                        <div className={styles.items_name_price}>
                                            <div className={styles.brands_basket}>
                                                {item.brands && item.brands.length > 0 ? (
                                                    item.brands.map(brand => (
                                                        <div
                                                            key={brand.id}
                                                            style={brandStyles[brand.id] || { color: 'black' }}
                                                            className={styles.brand_item_basket}
                                                        >
                                                            {brandIcons[brand.id] && (
                                                                <img
                                                                    src={brandIcons[brand.id]}
                                                                    alt={`${brand.name} icon`}
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
                                                <span className={styles.info}>Start: {item.info.start}</span>
                                                <span className={styles.info}>Content: {item.info.content}</span>
                                            </div>
                                            {item.originalPrice && item.price !== item.originalPrice && (
                                                <span className={styles.basket_item_original_price} style={{ textDecoration: 'line-through', color: 'grey' }}>
                                                    ${item.originalPrice}
                                                </span>
                                            )}
                                            <span className={styles.basket_item_price}>${item.price}</span>
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

                    return item.status !== 'available' ? (
                        <Badge.Ribbon
                            key={item.id}
                            text="SOLD"
                            color='red'
                        >
                            {basketItemContent}
                        </Badge.Ribbon>
                    ) : (
                        <React.Fragment key={item.id}>
                            {basketItemContent}
                        </React.Fragment>
                    );
                })}
                <button className={styles.clear_basket} onClick={handleClearBasket}>Clear cart</button>
            </div>

            <div className={styles.promo_code_section}>
                <div className={styles.promocodes}>
                    <h3>Apply Promocode</h3>
                    {/* Условие, которое проверяет, применен ли промокод */}
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
                            <button onClick={() => handleApplyPromoCode()}>Apply</button>
                        </>
                    )}
                </div>

                {/* User's personal promo codes */}
                <div className={styles.user_promocodes}>
                    {thing.userPromoCodes.length > 0 ? (
                        <div>
                            <h3>Your Promocodes:</h3>
                            <div>
                                {thing.userPromoCodes.map(promo => (
                                    <button
                                        key={promo.id}
                                        onClick={() => handleApplyPromoCode(promo.code)}
                                        className={styles.user_promocode_item}
                                        disabled={appliedPromoCode === promo.code}
                                    >
                                        {appliedPromoCode === promo.code ? `${promo.code} applied` : `${promo.code} $${promo.discountValue}`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p></p>
                    )}
                </div>
            </div>
            

            <div className={styles.basket_total}>
                <h3>Total amount: ${thing.totalPrice}</h3>
                {thing.discount > 0 && <p>Discount: ${thing.discount}</p>}
                <MyButton 
                    style={{width: 'calc(var(--index)* 25)'}}
                    text={'Go to payment'} 
                    onClick={handlePayment}
                    disabled={thing.basket.some(item => item.status !== 'available')}
                ></MyButton>

            </div>
        </div>
    );
});

export default Basket;
