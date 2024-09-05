import { observer } from "mobx-react-lite";
import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../index";
import { fetchPriceRange } from "../../http/thingAPI";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './PriceSlider.css';

const PriceSlider = observer(() => {
    const { thing } = useContext(Context);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000);
    const [currentPriceRange, setCurrentPriceRange] = useState([minPrice, maxPrice]);

    // Получаем диапазон цен всех товаров при первом рендере
    useEffect(() => {
        fetchPriceRange().then(data => {
            setMinPrice(data.minPrice);
            setMaxPrice(data.maxPrice);
            setCurrentPriceRange([data.minPrice, data.maxPrice]);
            console.log("Initial global prices set: ", { min: data.minPrice, max: data.maxPrice });
        }).catch(err => console.error("Error fetching price range: ", err));
    }, []);

    const handleSliderChange = (value) => {
        setCurrentPriceRange(value);
        console.log(`Price range changed: ${value}`);
    };

    const applyPriceFilter = () => {
        console.log("Applying price filter with values: ", { min: currentPriceRange[0], max: currentPriceRange[1] });
        thing.setPriceRange({ min: currentPriceRange[0], max: currentPriceRange[1] });
    };

    return (
        <div className="price-slider">
            <label>Minimum price: {currentPriceRange[0]}</label>
            <label>Maximum price: {currentPriceRange[1]}</label>
            <Slider
                range
                min={minPrice}
                max={maxPrice}
                value={currentPriceRange}
                onChange={handleSliderChange}
            />
            <button onClick={applyPriceFilter}>Подтвердить цену</button>
        </div>
    );
});

export default PriceSlider;
