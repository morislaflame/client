import React from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../index';
import styles from './SelectedFilters.module.css';

const SelectedFilters = observer(() => {
    const { thing } = React.useContext(Context);

    const hasFilters =
        Object.keys(thing.selectedType).length > 0 ||
        thing.selectedBrands.length > 0 ||
        (thing.priceRange.min !== 0 || thing.priceRange.max !== 10000);

    return (
        <div className={styles.selectedFilters}>
            {hasFilters ? (
                <div className={styles.brandType}>
                    {thing.selectedType.id && (
                        <div className={styles.filterType}>
                            <span className={styles.label}>Country:</span>
                            <span className={styles.value}>{thing.selectedType.name}</span>
                        </div>
                    )}
                    {thing.selectedBrands.length > 0 && (
                        <div className={styles.filterBrand}>
                            <span className={styles.label}>Platforms:</span>
                            <span className={styles.value}>
                                {thing.brands
                                    .filter(brand => thing.selectedBrands.includes(brand.id))
                                    .map(brand => brand.name)
                                    .join(', ')}
                            </span>
                        </div>
                    )}
                    {(thing.priceRange.min !== 0 || thing.priceRange.max !== 10000) && (
                        <div className={styles.filterPrice}>
                            <span className={styles.label}>Price:</span>
                            <span className={styles.value}>
                                {thing.priceRange.min} - {thing.priceRange.max}
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
