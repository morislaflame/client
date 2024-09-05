import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './MyButton.css';

const MyButton = ({ text, onClick }) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    
    // Анимация при наведении
    const hoverAnimation = gsap.to(button, {
      scale: 1.1,
      duration: 0.3,
      paused: true,
      ease: 'power3.out'
    });

    // Добавляем обработчики событий
    const handleMouseEnter = () => hoverAnimation.play();
    const handleMouseLeave = () => hoverAnimation.reverse();

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    // Очищаем обработчики при демонтировании компонента
    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className='main-button'>
      <div className='skelet'></div>
      <button ref={buttonRef} className="my-button" onClick={onClick}>
        {text}
      </button>
    </div>
  );
};

export default MyButton;
