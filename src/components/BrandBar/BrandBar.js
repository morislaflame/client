import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../../index";
import Card from "react-bootstrap/Card";
import './BrandBar.css';

const BrandBar = observer(() => {
    const {thing} = useContext(Context)
    return (
        <div className={'brand_bar'}>
            {thing.brands.map(brand =>
                <button className={`brand_button ${brand.id === thing.selectedBrand.id ? 'selected' : ''}`}
                    key={brand.id}
                    onClick={() => thing.setSelectedBrand(brand)}
                    
                >
                    {brand.name}
                </button>
            )}
        </div>
    );
});

export default BrandBar;