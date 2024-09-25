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
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from 'gsap/src/ScrollTrigger';
import { NavLink } from 'react-router-dom';
import { FloatButton } from "antd";

const Shop = observer(() => {
  const {thing} = useContext(Context)
  gsap.registerPlugin(ScrollTrigger);

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
          {/* <div className='shop-warnings'>
            <div className='telegram-int'>
              Fully integrated with Telegram
            </div>
          </div> */}
        </div>
      </div>
      
      <div className={styles.mainlist}>
      <ThingList/>
      <Pages/>
      </div>
      <FaqAccordion/>
      <FloatButton.BackTop 
        type='dark'
      />
    </div>
  );
});

export default Shop;