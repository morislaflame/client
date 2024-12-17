import { React, useContext, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../../index';
import styles from './SelectedFilters.module.css';
import { fetchPriceRange } from '../../../../http/modelProductAPI';

const SelectedFilters = observer(() => {
    const { model } = useContext(Context);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000);

    useEffect(() => {
        fetchPriceRange().then(data => {
            setMinPrice(data.minPriceUSD);
            setMaxPrice(data.maxPriceUSD);
        }).catch(err => console.error("Error fetching price range: ", err));
    }, []);

    const hasFilters =
        Object.keys(model.selectedCountry).length > 0 ||
        model.selectedAdultPlatforms.length > 0 ||
        (model.priceRange.min !== minPrice || model.priceRange.max !== maxPrice);

    return (
        <div className={styles.selectedFilters}>
            {hasFilters ? (
                <div className={styles.brandType}>
                    {model.selectedCountry.id && (
                        <div className={styles.filterType}>
                            <span className={styles.label}>Country:</span>
                            <span className={styles.value}>{model.selectedCountry.name}</span>
                        </div>
                    )}
                    {model.selectedAdultPlatforms.length > 0 && (
                        <div className={styles.filterBrand}>
                            <span className={styles.label}>Platforms:</span>
                            <span className={styles.value}>
                                {model.adultPlatforms
                                    .filter(adultPlatform => model.selectedAdultPlatforms.includes(adultPlatform.id))
                                    .map(adultPlatform => adultPlatform.name)
                                    .join(', ')}
                            </span>
                        </div>
                    )}
                    {(model.priceRange.min !== minPrice || model.priceRange.max !== maxPrice) && (
                        <div className={styles.filterPrice}>
                            <span className={styles.label}>Price:</span>
                            <span className={styles.value}>
                                ${model.priceRange.min} - ${model.priceRange.max}
                            </span>
                        </div>
                    )}
                </div>
            ) : (
                <div className={styles.noFilters}>Filters are not set</div>
            )}
        </div>
    );
});

export default SelectedFilters;
