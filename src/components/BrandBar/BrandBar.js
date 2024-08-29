import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../../index";
import './BrandBar.css';

const BrandBar = observer(() => {
    const {thing} = useContext(Context);

    const handleBrandClick = (brand) => {
        if (thing.selectedBrand.id === brand.id) {
            // Если бренд уже выбран, сбрасываем выбор
            thing.setSelectedBrand({});
        } else {
            // Иначе выбираем новый бренд
            thing.setSelectedBrand(brand);
        }
    };

    return (
        <div className={'brand_bar'}>
            {thing.brands.map(brand =>
                <button
                    className={`brand_button ${brand.id === thing.selectedBrand.id ? 'selected' : ''}`}
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
