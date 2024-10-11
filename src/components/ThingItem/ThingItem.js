import React from 'react';
import { useNavigate } from "react-router-dom";
import './ThingItem.css';
import { THING_ROUTE } from "../../utils/consts";
import MymIcon from '../../icons/Mym.png';
import FanslyIcon from '../../icons/fansly.png';
import OnlyIcon from '../../icons/onlyfans.png'


const ThingItem = ({thing}) => {
    const navigate = useNavigate();

    console.log('Images:', thing.images);

    const previewImage = thing.images && thing.images.length > 0 ? thing.images[0].img : 'placeholder.png';

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
                <img className={'card_img'} src={process.env.REACT_APP_API_URL + previewImage} alt={thing.name}/>
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
            </div>
        </div>
    );
};

export default ThingItem;
