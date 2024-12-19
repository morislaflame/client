import React from 'react';
import './LoadingIndicator.css';
import gsap from 'gsap';
import { ReactComponent as Path } from '../../../icons/Nuka.svg';
// import { ReactComponent as Path } from '../../../icons/Final.svg';
import { ReactComponent as Pin } from '../../../icons/pin.svg';
import { ReactComponent as Puls } from '../../../icons/Puls.svg';
// import { ReactComponent as Path2 } from '../../../icons/Orbita.svg';


import { useLayoutEffect } from 'react';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';


const LoadingIndicator = () => {
  gsap.registerPlugin(MotionPathPlugin);
  useLayoutEffect(() => {
    gsap.fromTo('.puls', {
      scale: 1,
    }, {
      scale: 1.5,
      duration: 1,
      repeat: -1,
      opacity: 0,
    });

  }, [])
  return (
    <div className='loading_indicator'>
      <Path className='path'/>
      <Puls className='puls'/>
    </div>
  );
};

export default LoadingIndicator;