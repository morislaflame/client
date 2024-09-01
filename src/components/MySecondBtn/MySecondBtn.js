import React from 'react';
import './MySecondBtn.css';

const MySecondBtn = ({ text, onClick }) => {

  return (
    <div className='main-button'>
        <button className="my-second-button" onClick={onClick}>
            {text}
        </button>
    </div>
    
  );
};

export default MySecondBtn;