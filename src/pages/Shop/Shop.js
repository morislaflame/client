import React, { useContext, useEffect } from 'react';
import styles from './Shop.module.css'
import ThingList from '../../components/ThingList';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { fetchBrands, fetchThings, fetchTypes } from '../../http/thingAPI';
import Pages from '../../components/Pages';
import SideBar from '../../components/SideBar/SideBar';
import StorySlider from '../../components/StorySlider/StorySlider';
import FaqAccordion from '../../components/FaqAccordion/FaqAccordion';
import { FloatButton } from "antd";
import Reviews from '../../components/Reviews/Reviews';

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
    <div className={styles.main_shop}>
      <div className={styles.shop_top}>
        <StorySlider/>
        <div className={styles.filters}>
          <SideBar/>
        </div>
      </div>
      <div className={styles.mainlist}>
          <ThingList/>
          <Pages/>
      </div>
      <Reviews/>
      <h2 style={{color: 'white', marginTop: '15px'}}>FAQ</h2>
      <FaqAccordion/>
      <FloatButton.BackTop 
        type='dark'
      />
    </div>
  );
});

export default Shop;