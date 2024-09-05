import React from 'react'
import TypeBar from '../TypeBar/TypeBar'
import BrandBar from '../BrandBar/BrandBar'
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState } from 'react';
import MyButton from '../MyButton/MyButton';
import './SideBar.css'
import PriceSlider from '../PriceSlider/PriceSlider';

export default function SideBar({ name, ...props }) {

    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);

  return (

    <>
      <MyButton text="Фильтры" onClick={toggleShow}/>
      <Offcanvas show={show} onHide={handleClose} scroll
      backdrop placement="top">
        <Offcanvas.Header>
          <Offcanvas.Title>FILTERS</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            <div className={'sidebar'}>
                <div>
                  <PriceSlider/>
                </div>
                <div>
                    <BrandBar/>
                </div>
                <div>
                    <TypeBar/>
                </div>
            </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
    
    
  )
}
