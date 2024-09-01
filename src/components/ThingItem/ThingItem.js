import { useNavigate } from "react-router-dom";
import './ThingItem.css';
import { THING_ROUTE } from "../../utils/consts";
import Badge from 'react-bootstrap/Badge';

const ThingItem = ({thing}) => {
    const navigate = useNavigate();
    
    // Используем первое изображение из массива images, если оно существует
    const previewImage = thing.images && thing.images.length > 0 ? thing.images[0].img : 'placeholder.png';

    // const firstBrand = thing.brands && thing.brands.length > 0 ? thing.brands[0].name : 'Unknown Brand';

    const brandStyles = {
        1: { color: '#008ccf' },  // Стиль для бренда с id: 1
        2: { color: '#1fa7df' },   // Стиль для бренда с id: 2
        3: { color: '#e8642c' }
    };

    // Иконки для брендов
    const brandIcons = {
        1: 'https://www.freedownloadlogo.com/logos/o/onlyfans-2.svg',  // URL для иконки бренда с id: 1
        2: 'https://socprofile.com/u/25823/socprofile.com_officialfansly._1662655605.png',   // URL для иконки бренда с id: 2
        3: 'https://luzriquelme.com/wp-content/uploads/2017/05/screen-shot-2015-11-20-at-1-15-51-pm.png'
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
                                    style={brandStyles[brand.id] || { color: 'black' }}  // Применяем стиль, если он есть
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
                        
                        <div>Content: {thing.info && thing.info.length > 0 ? thing.info[0].content : 'N/A'}</div>
                        <div>OF Verified: {thing.info && thing.info.length > 0 ? thing.info[0].ofverif : 'N/A'}</div>
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
