import React, { createContext, useState, useEffect } from 'react';
import { fetchBasket } from '../http/basketAPI';

export const BasketContext = createContext();

export const BasketProvider = ({ children }) => {
    const [basketCount, setBasketCount] = useState(0);

    useEffect(() => {
        fetchBasket().then(data => {
            setBasketCount(data.basket_things.length || 0);
        });
    }, []);

    const updateBasketCount = () => {
        fetchBasket().then(data => {
            setBasketCount(data.basket_things.length || 0);
        });
    };

    return (
        <BasketContext.Provider value={{ basketCount, updateBasketCount }}>
            {children}
        </BasketContext.Provider>
    );
};
