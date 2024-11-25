import { observer } from "mobx-react-lite";
import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../../../index";
import { fetchPriceRange } from "../../../../http/NonUsedAPI/thingAPI";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './PriceSlider.css';

const PriceSlider = observer(() => {
    const { model } = useContext(Context);
    const [minPriceUSD, setMinPriceUSD] = useState(0);
    const [maxPriceUSD, setMaxPriceUSD] = useState(10000);
    const [currentPriceRange, setCurrentPriceRange] = useState([minPriceUSD, maxPriceUSD]);

    useEffect(() => {
        fetchPriceRange().then(data => {
            setMinPriceUSD(data.minPriceUSD);
            setMaxPriceUSD(data.maxPriceUSD);
            setCurrentPriceRange([data.minPriceUSD, data.maxPriceUSD]);
            console.log("Initial global prices set: ", { min: data.minPriceUSD, max: data.maxPriceUSD });
        }).catch(err => console.error("Error fetching price range: ", err));
    }, []);

    // Добавляем useEffect для отслеживания изменений в thing.priceRange
    useEffect(() => {
        setCurrentPriceRange([model.priceRange.min, model.priceRange.max]);
    }, [model.priceRange]);

    const handleSliderChange = (value) => {
        setCurrentPriceRange(value);
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('soft');
          }
        console.log(`Price range changed: ${value}`);
    };

    const applyPriceFilter = () => {
        console.log("Applying price filter with values: ", { min: currentPriceRange[0], max: currentPriceRange[1] });
        model.setPriceRange({ min: currentPriceRange[0], max: currentPriceRange[1] });
    };

    return (
        <div className="price-slider">
            <div className='min-max'>
                <label>Minimum price: {currentPriceRange[0]}</label>
                <label>Maximum price: {currentPriceRange[1]}</label>
            </div>
            
            <Slider
                range
                min={minPriceUSD}
                max={maxPriceUSD}
                value={currentPriceRange}
                onChange={handleSliderChange}
            />
            <button onClick={applyPriceFilter}>Confirm</button>
        </div>
    );
});

export default PriceSlider;
