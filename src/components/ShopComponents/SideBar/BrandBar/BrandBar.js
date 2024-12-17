import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../../../../index";
import './BrandBar.css';
import { Button } from 'antd';
import OnlyIcon from '../../../../icons/onlyfans.png';
import MymIcon from '../../../../icons/Mym.png';
import FanslyIcon from '../../../../icons/fansly.png';

const BrandBar = observer(() => {
    const { model } = useContext(Context);

    const getPlatformIcon = (platformName) => {
        switch(platformName.toLowerCase()) {
            case 'onlyfans':
                return OnlyIcon;
            case 'mym':
                return MymIcon;
            case 'fansly':
                return FanslyIcon;
            default:
                return null;
        }
    };

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
        <div className='container-card'>
            <div className='container-item'>
                <h3 style={{ margin: '0' }}>Platform</h3>
                <div className='container-item-buttons'>
                    {model.adultPlatforms.map(adultPlatform => {
                        const icon = getPlatformIcon(adultPlatform.name);
                        return (
                        <Button
                            className={`brand_button ${model.selectedAdultPlatforms.includes(adultPlatform.id) ? 'selected' : ''}`}
                            key={adultPlatform.id}
                            onClick={() => handleAdultPlatformClick(adultPlatform)}
                        >
                            {icon && (
                                <img 
                                    src={icon} 
                                    alt={adultPlatform.name}
                                    className="platform_icon"
                                />
                            )}
                            {adultPlatform.name}
                        </Button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});

export default BrandBar;
