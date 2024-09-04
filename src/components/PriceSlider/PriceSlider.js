import { observer } from "mobx-react-lite";
import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../index";
import { fetchPriceRange } from "../../http/thingAPI"; // Импортируем метод для получения диапазона цен
import './PriceSlider.css';

const PriceSlider = observer(() => {
    const { thing } = useContext(Context);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000);
    const [currentMinPrice, setCurrentMinPrice] = useState(minPrice);
    const [currentMaxPrice, setCurrentMaxPrice] = useState(maxPrice);

    // Получаем диапазон цен всех товаров при первом рендере
    useEffect(() => {
        fetchPriceRange().then(data => {
            setMinPrice(data.minPrice);
            setMaxPrice(data.maxPrice);
            setCurrentMinPrice(data.minPrice);
            setCurrentMaxPrice(data.maxPrice);
            console.log("Initial global prices set: ", { min: data.minPrice, max: data.maxPrice });
        }).catch(err => console.error("Error fetching price range: ", err));
    }, []);

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        if (name === "min") {
            setCurrentMinPrice(value);
        } else {
            setCurrentMaxPrice(value);
        }
        console.log(`Price changed: ${name} = ${value}`);
    };

    const applyPriceFilter = () => {
        console.log("Applying price filter with values: ", { min: currentMinPrice, max: currentMaxPrice });
        thing.setPriceRange({ min: currentMinPrice, max: currentMaxPrice });
    };

    return (
        <div className="price-slider">
            <label>Минимальная цена: {currentMinPrice}</label>
            <input
                type="range"
                name="min"
                min={minPrice}
                max={maxPrice}
                value={currentMinPrice}
                onChange={handlePriceChange}
            />
            <label>Максимальная цена: {currentMaxPrice}</label>
            <input
                type="range"
                name="max"
                min={minPrice}
                max={maxPrice}
                value={currentMaxPrice}
                onChange={handlePriceChange}
            />
            <button onClick={applyPriceFilter}>Подтвердить цену</button>
        </div>
    );
});

export default PriceSlider;
