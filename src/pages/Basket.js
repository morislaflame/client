// components/Basket/Basket.js

import React, { useEffect, useState, useContext } from 'react';
import styles from './Basket.module.css'
import { useNavigate } from 'react-router-dom';
import { Context } from '../index'; // Убедитесь, что путь корректен
import MyButton from '../components/MyButton/MyButton';
import MySecondBtn from '../components/MySecondBtn/MySecondBtn';
import MymIcon from '../icons/Mym.png';
import FanslyIcon from '../icons/fansly.png';
import OnlyIcon from '../icons/onlyfans.png';
import { observer } from 'mobx-react-lite';
import BackButton from '../components/BackButton/BackButton';

const Basket = observer(() => {
    const { thing } = useContext(Context);
    const navigate = useNavigate();
    const [promoCodeInput, setPromoCodeInput] = useState('');

    useEffect(() => {
        thing.loadBasket();
        thing.loadUserPromoCodes();
    }, [thing]);

    const handleRemove = async (thingId) => {
        try {
            await thing.removeFromBasket(thingId);
        } catch (error) {
            alert('Ошибка при удалении товара из корзины: ' + error.message);
        }
    };

    const handleClearBasket = async () => {
        try {
            await thing.clearBasket();
        } catch (error) {
            alert('Ошибка при очистке корзины: ' + error.message);
        }
    };

    const handleApplyPromoCode = async () => {
        if (!promoCodeInput) {
            alert('Пожалуйста, введите промокод');
            return;
        }

        const result = await thing.applyPromoCode(promoCodeInput);
        if (!result.success) {
            alert(result.message || 'Ошибка при применении промокода');
        } else {
            setPromoCodeInput('');
        }
    };

    const handleRemovePromoCode = async () => {
        await thing.removePromoCode();
    };

    const handlePayment = () => {
        navigate('/payment', { state: { totalAmount: thing.totalPrice } });
    };

    if (thing.basket.length === 0) {
        return <div className="basket-empty">Your Cart Is Empty</div>;
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
                {thing.basket.map(item => (
                    <div key={item.id} className={styles.basket_item}>
                        {item.images && item.images.length > 0 ? (
                            <img src={process.env.REACT_APP_API_URL + item.images[0].img} alt={item.name} className={styles.basket_item_img} />
                        ) : (
                            <img src="/path/to/default/image.png" alt="Нет изображения" className={styles.basket_item_img} />
                        )}
                        <div className={styles.basket_item_info}>
                            <div className={styles.info_brand}>
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
                                <div className={styles.items_name_price}>
                                    <span className={styles.basket_item_name}>{item.name}</span>
                                    {item.originalPrice && item.price !== item.originalPrice && (
                                        <span className={styles.basket_item_original_price} style={{ textDecoration: 'line-through', color: 'grey' }}>
                                            ${item.originalPrice}
                                        </span>
                                    )}
                                    <span className={styles.basket_item_price}>${item.price}</span>
                                </div>
                            </div>
                            <button onClick={() => handleRemove(item.id)} className={styles.basket_item_remove}>Remove</button>
                        </div>
                    </div>
                ))}
                <MySecondBtn className={styles.clear_basket} text={'Clear cart'} onClick={handleClearBasket}></MySecondBtn>
            </div>

            <div className={styles.promo_code_section}>
                <div className={styles.promocodes}>
                    <h3>Apply Promo Code</h3>
                    <input
                        type="text"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        placeholder="Enter promo code"
                        className={styles.apply_promo_input}
                    />
                    <button onClick={handleApplyPromoCode}>Apply</button>
                    {thing.promoCode && (
                        <div className={styles.applied_promocode_}>
                            <p>Applied Promo Code: {thing.promoCode.code}</p>
                            <button onClick={handleRemovePromoCode}>Remove Promo Code</button>
                        </div>
                    )}
                </div>

                {/* User's personal promo codes */}
                <div className={styles.user_promocodes}>
                    <h3>Your Promo Codes</h3>
                    {thing.userPromoCodes.length > 0 ? (
                        <ul>
                            {thing.userPromoCodes.map(promo => (
                                <li key={promo.id}>
                                    <strong>{promo.code}</strong> - Discount: ${promo.discountValue}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>You have no promo codes.</p>
                    )}
                </div>
            </div>
            

            <div className={styles.basket_total}>
                <h3>Total amount: ${thing.totalPrice}</h3>
                {thing.discount > 0 && <p>Discount: ${thing.discount}</p>}
                <MyButton className={styles.pay_button} text={'Go to payment'} onClick={handlePayment}></MyButton>
            </div>
        </div>
    );
});

export default Basket;
