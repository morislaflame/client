import React from 'react';
import { useNavigate } from "react-router-dom";
import './ThingItem.css';
import { THING_ROUTE } from "../../utils/consts";
import MymIcon from '../../icons/Mym.png';
import FanslyIcon from '../../icons/fansly.png';
import OnlyIcon from '../../icons/onlyfans.png'
import { Skeleton } from 'antd';
import Placeholder from '../../icons/placeholder.jpg';


const ThingItem = ({thing}) => {
    const navigate = useNavigate();

    const previewImage = thing.images && thing.images.length > 0 ? thing.images[0].img : Placeholder;
    console.log("Loaded image:", previewImage); // Добавляем console.log для загруженного изображения

    

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
        <div className={'card_list'} onClick={() => navigate(THING_ROUTE + "/" + thing.id)}>
            <div className={'card'}>
                {thing ? ( // Проверяем, загружен ли контент
                    <>
                        <img 
  className={'card_img'} 
  src={`${process.env.REACT_APP_API_URL}${previewImage}?ngrok-skip-browser-warning=true`} 
  alt={thing.name}
/>

                        console.log("")
                        <div className="descript">
                            {thing.brands && thing.brands.length > 0 ? (
                                thing.brands.map(brand => (
                                    <div 
                                        key={brand.id} 
                                        style={brandStyles[brand.id] || { color: 'black' }}  
                                        className="brand-item"
                                    >
                                        {brandIcons[brand.id] && (
                                            <img 
                                                src={brandIcons[brand.id]} 
                                                alt={`${brand.name} icon`} 
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
                                {thing.name}
                            </div>
                            <div className="thing-info">
                                <div><b>Content:</b> {thing.info && thing.info.content ? thing.info.content : 'N/A'}</div>
                                <div><b>OF Verified:</b> {thing.info && thing.info.ofverif ? thing.info.ofverif : 'N/A'}</div>
                            </div>
                            <div className="thing-price">
                                ${thing.price}
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

export default ThingItem;
