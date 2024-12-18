import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Drawer, Button } from 'antd';
import TypeBar from './TypeBar/TypeBar';
import BrandBar from './BrandBar/BrandBar';
import { useContext } from 'react';
import './SideBar.css';
import PriceSlider from './PriceSlider/PriceSlider';
import SelectedFilters from './SelectedFilters/SelectedFilters';
import { Context } from '../../../index';
import { fetchPriceRange } from '../../../http/modelProductAPI';

const SideBar = observer(({ name, ...props }) => {
    const [show, setShow] = useState(false);
    const { model } = useContext(Context);
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        fetchPriceRange().then(data => {
            setMinPrice(data.minPriceUSD);
            setMaxPrice(data.maxPriceUSD);
            setIsInitialized(true);
        }).catch(err => console.error("Error fetching price range: ", err));
    }, []);

    const handleClose = () => setShow(false);
    const toggleShow = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        setShow((s) => !s);
    };

    const handleReset = () => {
        model.setSelectedCountry({});
        model.setSelectedAdultPlatforms([]);
        if (isInitialized) {
            model.setPriceRange({ min: minPrice, max: maxPrice });
        }
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }
    };

    const hasFilters =
        Object.keys(model.selectedCountry).length > 0 ||
        model.selectedAdultPlatforms.length > 0 ||
        (isInitialized && model.priceRange.min !== null && model.priceRange.max !== null && 
         (model.priceRange.min !== minPrice || model.priceRange.max !== maxPrice));

    return (
        <>
            <div className="sidebar-header">
                <div className="filters-container">
                    <SelectedFilters />
                    <div className="filters-buttons">
                        <Button type='ghost' className="filters-button" onClick={toggleShow}>
                            Filters
                        </Button>
                        {hasFilters && (
                            <button onClick={handleReset} className="reset-filters-button">
                                Reset filters
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <Drawer
                title="FILTERS"
                placement="top"
                onClose={() => {
                    handleClose();
                    if (window.Telegram?.WebApp?.HapticFeedback) {
                        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
                    }
                }}
                open={show}
                height={`auto`}
                styles={{
                    content: {
                        borderBottomLeftRadius: `calc(var(--index) * 2)`,
                        borderBottomRightRadius: `calc(var(--index) * 2)`,
                        borderTopLeftRadius: `0`,
                    }
                }}
            >
                <div className={'sidebar'}>
                    <div className='container-item'>
                        
                        <BrandBar />
                        <TypeBar />
                        <PriceSlider />
                    </div>
                </div>
            </Drawer>
        </>
    );
});

export default SideBar;
