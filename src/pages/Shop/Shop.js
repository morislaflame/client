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

const Shop = observer(() => {
  const {thing} = useContext(Context)
  
  useEffect(() => {
    fetchTypes().then(data => thing.setTypes(data))
    fetchBrands().then(data => thing.setBrands(data))
    fetchThings(null, null, 1, 6).then(data => { // Здесь указываем кол-во товаров на странице
      thing.setThings(data.rows)
      thing.setTotalCount(data.count)
    })
  }, [])

  useEffect(() => {
    fetchThings(thing.selectedType.id, thing.selectedBrand.id, thing.page, 6).then(data => {
      thing.setThings(data.rows)
      thing.setTotalCount(data.count)
    })
  }, [thing.page, thing.selectedType, thing.selectedBrand])

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', minHeight: '100vh', backgroundColor: 'black'}}>
      <div className='filters'><SideBar/></div>
      <div className={'mainlist'}>
      <ThingList/>
      <Pages/>
      </div>
      
    </div>
  );
});

export default Shop;