import React from 'react';
import { useNavigate } from "react-router-dom";
import './ModelItem.css';
import { THING_ROUTE } from "../../../utils/consts";
import MymIcon from '../../../icons/Mym.png';
import FanslyIcon from '../../../icons/fansly.png';
import OnlyIcon from '../../../icons/onlyfans.png'
import { Skeleton } from 'antd';
import Placeholder from '../../../icons/placeholder.jpg';


const ModelItem = ({model}) => {
    const navigate = useNavigate();

    const previewImage = model.images && model.images.length > 0 ? model.images[0].img : Placeholder;

    const brandStyles = {
        1: { color: '#008ccf' },
        2: { color: '#1fa7df' },
        3: { color: '#e8642c' }
    };

    const brandIcons = {
        1: OnlyIcon,
        2: FanslyIcon,
        3: MymIcon
    };

    return (
        <div className={'card_list'} onClick={() => navigate(THING_ROUTE + "/" + model.id)}>
            <div className={'card'}>
                {model ? ( // Проверяем, загружен ли контент
                    <>
                        <img className={'card_img'} src={process.env.REACT_APP_API_URL + previewImage} alt={model.name}/>
                        <div className="descript">
                            {model.adultPlatforms && model.adultPlatforms.length > 0 ? (
                                model.adultPlatforms.map(adultPlatform => (
                                    <div 
                                        key={adultPlatform.id} 
                                        style={brandStyles[adultPlatform.id] || { color: 'black' }}  
                                        className="brand-item"
                                    >
                                        {brandIcons[adultPlatform.id] && (
                                            <img 
                                                src={brandIcons[adultPlatform.id]} 
                                                alt={`${adultPlatform.name} icon`} 
                                                className="brand-icon"
                                            />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div>Unknown Brand</div>
                            )}
                        </div>
                        <div className="thing-all">
                            <div className="thingName">
                                {model.name}
                            </div>
                            <div className="thing-info">
                                <div><b>Content:</b> {model.info && model.info.content ? model.info.content : 'N/A'}</div>
                                <div><b>OF Verified:</b> {model.info && model.info.ofverif ? model.info.ofverif : 'N/A'}</div>
                            </div>
                            <div className="thing-price">
                                ${model.priceUSD}
                            </div>
                        </div>
                    </>
                ) : (
                    <Skeleton active paragraph={{ rows: 4 }} /> // Добавляем Skeleton для загрузки
                )}
            </div>
        </div>
    );
};

export default ModelItem;