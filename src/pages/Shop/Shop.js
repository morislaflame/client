import React, { useContext, useEffect } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/Row';
import TypeBar from '../../components/TypeBar/TypeBar';
import './Shop.css'
import BrandBar from '../../components/BrandBar/BrandBar';
import ThingList from '../../components/ThingList';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { fetchBrands, fetchThings, fetchTypes } from '../../http/thingAPI';
import Pages from '../../components/Pages';

const Shop = observer(() => {
  const {thing} = useContext(Context)
  
  useEffect(() => {
    fetchTypes().then(data => thing.setTypes(data))
    fetchBrands().then(data => thing.setBrands(data))
    fetchThings(null, null, 1, 2).then(data => { // Здесь указываем кол-во товаров на странице
      thing.setThings(data.rows)
      thing.setTotalCount(data.count)
    })
  }, [])

  useEffect(() => {
    fetchThings(thing.selectedType.id, thing.selectedBrand.id, thing.page, 2).then(data => { // Здесь указываем кол-во товаров на странице
      thing.setThings(data.rows)
      thing.setTotalCount(data.count)
    })
  }, [thing.page, thing.selectedType, thing.selectedBrand])

  return (
    <div style={{display: 'flex', minHeight: '100vh'}}>
      <div className={'sidebar'}>
        <div>
          <TypeBar/>
        </div>
        <div>
          <BrandBar/>
        </div>
      </div>
      <div className={'mainlist'}>
      <ThingList/>
      <Pages/>
      </div>
      
    </div>
  );
});

export default Shop;