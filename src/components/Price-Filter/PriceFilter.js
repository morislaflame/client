import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../index";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './PriceFilter.css'; // Создай стили для компонента

const PriceFilter = () => {
    const { thing } = useContext(Context);
    const [priceRange, setPriceRange] = useState([0, 1000]); // Начальный диапазон
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);

    // Когда товары обновляются, пересчитываем минимальную и максимальную цену
    useEffect(() => {
        if (thing.things.length > 0) {
            const prices = thing.things.map(item => item.price);
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            setMinPrice(min);
            setMaxPrice(max);
            setPriceRange([min, max]);
        }
    }, [thing.things]);

    const onSliderChange = (value) => {
        setPriceRange(value);
    };

    const applyPriceFilter = () => {
        // Применяем фильтр по цене
        thing.setThings(
            thing.things.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1])
        );
    };

    return (
        <div className="price-filter">
            <h4>Фильтр по цене</h4>
            <Slider
                range
                min={minPrice}
                max={maxPrice}
                defaultValue={[minPrice, maxPrice]}
                value={priceRange}
                onChange={onSliderChange}
                step={10} // Шаг ползунка
            />
            <div className="price-values">
                <span>Минимум: ${priceRange[0]}</span>
                <span>Максимум: ${priceRange[1]}</span>
            </div>
            <button onClick={applyPriceFilter} className="apply-price-button">Подтвердить цену</button>
        </div>
    );
};

export default PriceFilter;
