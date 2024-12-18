import { observer } from "mobx-react-lite";
import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../../../index";
import { fetchPriceRange } from "../../../../http/modelProductAPI";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './PriceSlider.css';

const PriceSlider = observer(() => {
    const { model } = useContext(Context);
    const [minPriceUSD, setMinPriceUSD] = useState(0);
    const [maxPriceUSD, setMaxPriceUSD] = useState(10000);
    const [currentPriceRange, setCurrentPriceRange] = useState([minPriceUSD, maxPriceUSD]);
    const [leftPosition, setLeftPosition] = useState(0);
    const [rightPosition, setRightPosition] = useState(100);

    useEffect(() => {
        fetchPriceRange().then(data => {
            setMinPriceUSD(data.minPriceUSD);
            setMaxPriceUSD(data.maxPriceUSD);
            setCurrentPriceRange([data.minPriceUSD, data.maxPriceUSD]);
            model.initializePriceRange(data.minPriceUSD, data.maxPriceUSD);
            console.log("Initial global prices set: ", { min: data.minPriceUSD, max: data.maxPriceUSD });
        }).catch(err => console.error("Error fetching price range: ", err));
    }, []);

    useEffect(() => {
        setCurrentPriceRange([model.priceRange.min, model.priceRange.max]);
        const leftPercent = ((model.priceRange.min - minPriceUSD) / (maxPriceUSD - minPriceUSD)) * 100;
        const rightPercent = ((model.priceRange.max - minPriceUSD) / (maxPriceUSD - minPriceUSD)) * 100;
        setLeftPosition(leftPercent);
        setRightPosition(rightPercent);
    }, [model.priceRange, minPriceUSD, maxPriceUSD]);

    const handleSliderChange = (value) => {
        setCurrentPriceRange(value);
        const leftPercent = ((value[0] - minPriceUSD) / (maxPriceUSD - minPriceUSD)) * 100;
        const rightPercent = ((value[1] - minPriceUSD) / (maxPriceUSD - minPriceUSD)) * 100;
        setLeftPosition(leftPercent);
        setRightPosition(rightPercent);

        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('soft');
        }
    };

    const handleAfterChange = (value) => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }
        model.setPriceRange({ min: value[0], max: value[1] });
        console.log("Price range applied: ", { min: value[0], max: value[1] });
    };

    return (
        <div className="container-card">
            <div className='price-slider'>
                <h3 style={{ margin: '0', alignSelf: 'center' }}>Price</h3>
                
                <div className="slider-container">
                    <div 
                        className="price-label min-price" 
                        style={{ left: `${leftPosition}%` }}
                    >
                        ${currentPriceRange[0]}
                    </div>
                    <div 
                        className="price-label max-price" 
                        style={{ left: `${rightPosition}%` }}
                    >
                        ${currentPriceRange[1]}
                    </div>
                    <Slider
                        range
                        min={minPriceUSD}
                        max={maxPriceUSD}
                        value={currentPriceRange}
                        onChange={handleSliderChange}
                        onChangeComplete={handleAfterChange}
                    />
                </div>
            </div>
        </div>
    );
});

export default PriceSlider;
