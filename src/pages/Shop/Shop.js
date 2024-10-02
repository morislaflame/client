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
import { FiExternalLink } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { TERMS_ROUTE } from '../../utils/consts';
import Reviews from '../../components/Reviews/Reviews';
import { IoMdLock } from "react-icons/io";

const Shop = observer(() => {
  const {thing} = useContext(Context)
  const navigate = useNavigate()
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
          
        </div>
      </div>
      
      <div className={styles.mainlist}>
          <ThingList/>
          <Pages/>
      </div>
      <h2 style={{color: 'white', marginTop: '15px'}}>FAQ</h2>
      <FaqAccordion/>
      <Reviews/>
      <FloatButton.BackTop 
        type='dark'
      />
    </div>
  );
});

export default Shop;