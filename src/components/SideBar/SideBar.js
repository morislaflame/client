import React from 'react';
import { observer } from 'mobx-react-lite';
import TypeBar from '../TypeBar/TypeBar';
import BrandBar from '../BrandBar/BrandBar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState, useContext } from 'react';
import MyButton from '../MyButton/MyButton';
import './SideBar.css';
import PriceSlider from '../PriceSlider/PriceSlider';
import SelectedFilters from '../SelectedFilters/SelectedFilters';
import { Context } from '../../index';
import { IoFilterOutline } from "react-icons/io5";

const SideBar = observer(({ name, ...props }) => {
    const [show, setShow] = useState(false);
    const { thing } = useContext(Context);

    const handleClose = () => setShow(false);
    const toggleShow = () => setShow((s) => !s);

    return (
        <>
            <div className="sidebar-header">
                <SelectedFilters />
                <button className="filters-button" onClick={toggleShow} >
                  <IoFilterOutline />
                  Filters
                </button>
                
            </div>
            <Offcanvas show={show} onHide={handleClose} scroll backdrop placement="top">
                <Offcanvas.Header>
                    <Offcanvas.Title>FILTERS</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className={'sidebar'}>
                        <div>
                            <PriceSlider />
                        </div>
                        <div>
                            <BrandBar />
                        </div>
                        <div>
                            <TypeBar />
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
});

export default SideBar;
