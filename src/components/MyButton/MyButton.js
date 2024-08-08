import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SHOP_ROUTE } from '../../utils/consts';
import './MyButton.css';

const MyButton = ({ text }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(SHOP_ROUTE);
  };

  return (
    <div className='main-button'>
        <div className='skelet'></div>
        <button className="my-button" onClick={handleClick}>
            {text}
        </button>
    </div>
    
  );
};

export default MyButton;