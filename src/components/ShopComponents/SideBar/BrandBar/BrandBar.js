import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../../../../index";
import './BrandBar.css';

const BrandBar = observer(() => {
    const { model } = useContext(Context);

    const handleAdultPlatformClick = (adultPlatform) => {
        if (model.selectedAdultPlatforms.includes(adultPlatform.id)) {
            model.setSelectedAdultPlatforms(model.selectedAdultPlatforms.filter(id => id !== adultPlatform.id));
        } else {
            model.setSelectedAdultPlatforms([...model.selectedAdultPlatforms, adultPlatform.id]);
        }
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }
    };

    return (
        <div className={'brand_bar'}>
            {model.adultPlatforms.map(adultPlatform =>
                <button
                    className={`brand_button ${model.selectedAdultPlatforms.includes(adultPlatform.id) ? 'selected' : ''}`}
                    key={adultPlatform.id}
                    onClick={() => handleAdultPlatformClick(adultPlatform)}
                >
                    {adultPlatform.name}
                </button>
            )}
        </div>
    );
});

export default BrandBar;
