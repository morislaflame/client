// components/Basket/Basket.js

import React, { useEffect, useState, useContext } from 'react';
import './Basket.css';
import { useNavigate } from 'react-router-dom';
import { Context } from '../index'; // Убедитесь, что путь корректен
import MyButton from '../components/MyButton/MyButton';
import MySecondBtn from '../components/MySecondBtn/MySecondBtn';
import MymIcon from '../icons/Mym.png';
import FanslyIcon from '../icons/fansly.png';
import OnlyIcon from '../icons/onlyfans.png';
import { observer } from 'mobx-react-lite';

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
        <div className="basket-page">
            <h2>Your cart</h2>

            <div className="basket-items">
                {thing.basket.map(item => (
                    <div key={item.id} className="basket-item">
                        {item.images && item.images.length > 0 ? (
                            <img src={process.env.REACT_APP_API_URL + item.images[0].img} alt={item.name} className="basket-item-img" />
                        ) : (
                            <img src="/path/to/default/image.png" alt="Нет изображения" className="basket-item-img" />
                        )}
                        <div className="basket-item-info">
                            <div className='info-brand'>
                                <div className="brands-basket">
                                    {item.brands && item.brands.length > 0 ? (
                                        item.brands.map(brand => (
                                            <div
                                                key={brand.id}
                                                style={brandStyles[brand.id] || { color: 'black' }}
                                                className="brand-item-basket"
                                            >
                                                {brandIcons[brand.id] && (
                                                    <img
                                                        src={brandIcons[brand.id]}
                                                        alt={`${brand.name} icon`}
                                                        className="brands-icons-basket"
                                                    />
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div>Unknown Brand</div>
                                    )}
                                </div>
                                <div className='items-name-price'>
                                    <span className="basket-item-name">{item.name}</span>
                                    {item.originalPrice && item.price !== item.originalPrice && (
                                        <span className="basket-item-original-price" style={{ textDecoration: 'line-through', color: 'grey' }}>
                                            ${item.originalPrice}
                                        </span>
                                    )}
                                    <span className="basket-item-price">${item.price}</span>
                                </div>
                            </div>
                            <button onClick={() => handleRemove(item.id)} className="basket-item-remove">Remove</button>
                        </div>
                    </div>
                ))}
                <MySecondBtn className="clear-basket" text={'Clear cart'} onClick={handleClearBasket}></MySecondBtn>
            </div>

            {/* Promo code section */}
            <div className="promo-code-section">
                <h3>Apply Promo Code</h3>
                <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="Enter promo code"
                />
                <button onClick={handleApplyPromoCode}>Apply</button>
                {thing.promoCode && (
                    <div className="applied-promo-code">
                        <p>Applied Promo Code: {thing.promoCode.code}</p>
                        <button onClick={handleRemovePromoCode}>Remove Promo Code</button>
                    </div>
                )}
            </div>

            {/* User's personal promo codes */}
            <div className="user-promo-codes">
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

            <div className="basket-total">
                <h3>Total amount: ${thing.totalPrice}</h3>
                {thing.discount > 0 && <p>Discount: ${thing.discount}</p>}
                <MyButton className="pay-button" text={'Go to payment'} onClick={handlePayment}></MyButton>
            </div>
        </div>
    );
});

export default Basket;
