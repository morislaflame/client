import React from 'react';
import './MyButton.css';

const MyButton = ({ text, onClick }) => {

  return (
    <div className='main-button'>
      <div className='skelet'></div>
      <button className="my-button" onClick={onClick}>
        {text}
      </button>
    </div>
  );
};

export default MyButton;
