import React, { useContext, useEffect } from 'react';
import TypeBar from '../../components/TypeBar/TypeBar';
import './Shop.css'
import BrandBar from '../../components/BrandBar/BrandBar';
import ThingList from '../../components/ThingList';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { fetchBrands, fetchThings, fetchTypes } from '../../http/thingAPI';
import Pages from '../../components/Pages';
import SideBar from '../../components/SideBar/SideBar';
import StorySlider from '../../components/StorySlider/StorySlider';
import FaqAccordion from '../../components/FaqAccordion/FaqAccordion';

const Shop = observer(() => {
  const {thing} = useContext(Context)
  
  useEffect(() => {
    fetchTypes().then(data => thing.setTypes(data));
    fetchBrands().then(data => thing.setBrands(data));
    fetchThings(null, null, 1, 6).then(data => {
      thing.setThings(data.rows);
      thing.setTotalCount(data.count);
    });
  }, []);

  useEffect(() => {
    // Передаем параметры minPrice и maxPrice из стора
    const { min, max } = thing.priceRange;
    fetchThings(thing.selectedType.id, thing.selectedBrands, thing.page, 6, min, max).then(data => {
      thing.setThings(data.rows);
      thing.setTotalCount(data.count);
    });
  }, [thing.page, thing.selectedType, thing.selectedBrands, thing.priceRange]);  // Добавляем priceRange в зависимости


  

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', minHeight: '100vh', backgroundColor: 'black'}}>
      <StorySlider/>
      <div className='filters'><SideBar/></div>
      <div className={'mainlist'}>
      <ThingList/>
      <Pages/>
      </div>
      <FaqAccordion/>
    </div>
  );
});

export default Shop;