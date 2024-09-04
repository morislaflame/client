import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../../index";
import './BrandBar.css';

const BrandBar = observer(() => {
    const { thing } = useContext(Context);

    const handleBrandClick = (brand) => {
        if (thing.selectedBrands.includes(brand.id)) {
            // Если бренд уже выбран, удаляем его из массива
            thing.setSelectedBrands(thing.selectedBrands.filter(id => id !== brand.id));
        } else {
            // Иначе добавляем новый бренд
            thing.setSelectedBrands([...thing.selectedBrands, brand.id]);
        }
    };

    return (
        <div className={'brand_bar'}>
            {thing.brands.map(brand =>
                <button
                    className={`brand_button ${thing.selectedBrands.includes(brand.id) ? 'selected' : ''}`}
                    key={brand.id}
                    onClick={() => handleBrandClick(brand)}
                >
                    {brand.name}
                </button>
            )}
        </div>
    );
});

export default BrandBar;
