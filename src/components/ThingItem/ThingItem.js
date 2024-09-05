import React, { useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { gsap } from 'gsap';
import './ThingItem.css';
import { THING_ROUTE } from "../../utils/consts";
import Badge from 'react-bootstrap/Badge';

const ThingItem = ({thing}) => {
    const navigate = useNavigate();
    const cardRef = useRef(null);

    // Используем первое изображение из массива images, если оно существует
    const previewImage = thing.images && thing.images.length > 0 ? thing.images[0].img : 'placeholder.png';

    const brandStyles = {
        1: { color: '#008ccf' },
        2: { color: '#1fa7df' },
        3: { color: '#e8642c' }
    };

    const brandIcons = {
        1: 'https://www.freedownloadlogo.com/logos/o/onlyfans-2.svg',
        2: 'https://socprofile.com/u/25823/socprofile.com_officialfansly._1662655605.png',
        3: 'https://luzriquelme.com/wp-content/uploads/2017/05/screen-shot-2015-11-20-at-1-15-51-pm.png'
    };

    useEffect(() => {
        const card = cardRef.current;

        // Анимация при наведении
        const hoverAnimation = gsap.to(card, {
            scale: 1.05,
            duration: 0.3,
            paused: true,
            ease: 'power3.out'
        });

        const handleMouseEnter = () => hoverAnimation.play();
        const handleMouseLeave = () => hoverAnimation.reverse();

        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div className={'card_list'} onClick={() => navigate(THING_ROUTE + "/" + thing.id)}>
            <div className={'card'} ref={cardRef}>
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
                        <div><b>Content:</b> {thing.info && thing.info.length > 0 ? thing.info[0].content : 'N/A'}</div>
                        <div><b>OF Verified:</b> {thing.info && thing.info.length > 0 ? thing.info[0].ofverif : 'N/A'}</div>
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
