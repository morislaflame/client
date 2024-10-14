import React, { useContext, useEffect, Suspense, useState } from 'react';
import styles from './Shop.module.css'
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { fetchBrands, fetchThings, fetchTypes } from '../../http/thingAPI';
import Pages from '../../components/Pages';
import StorySlider from '../../components/StorySlider/StorySlider';
import { FloatButton, Skeleton } from "antd";
import FaqAccordion from '../../components/FaqAccordion/FaqAccordion';


const SideBar = React.lazy(() => import('../../components/SideBar/SideBar'));
const Reviews = React.lazy(() => import('../../components/Reviews/Reviews'));
const ThingList = React.lazy(() => import('../../components/ThingList'));

const Shop = observer(() => {
  const {thing} = useContext(Context)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const savedPage = sessionStorage.getItem('currentPage');
    if (savedPage) {
      thing.setPage(Number(savedPage));
    }

    fetchTypes().then(data => thing.setTypes(data));
    fetchBrands().then(data => thing.setBrands(data));
    fetchThings(null, null, thing.page, 20).then(data => {
      thing.setThings(data.rows);
      thing.setTotalCount(data.count);
      setLoading(false);
    });
  }, [thing]);

  useEffect(() => {
    // Передаем параметры minPrice и maxPrice из стора
    const { min, max } = thing.priceRange;
    fetchThings(thing.selectedType.id, thing.selectedBrands, thing.page, 20, min, max).then(data => {
      thing.setThings(data.rows);
      thing.setTotalCount(data.count);
    });
    sessionStorage.setItem('currentPage', thing.page);
    setLoading(false);
  }, [thing.page, thing.selectedType, thing.selectedBrands, thing.priceRange]);  // Добавляем priceRange в зависимости

  return (
    <div className={styles.main_shop}>
      <div className={styles.shop_top}>
        <StorySlider/>
        <div className={styles.filters}>
          <Suspense fallback={<Skeleton active />}>
            <SideBar/>
          </Suspense>
        </div>
      </div>
      <div className={styles.mainlist}>
        <Suspense fallback={<Skeleton active />}>
          <ThingList loading={loading}/>
        </Suspense>
          <Pages/>
        
      </div>
      <Suspense fallback={<Skeleton active />}>
        <Reviews/>
      </Suspense>
        <h2 style={{color: 'white', marginTop: '15px'}}>FAQ</h2>
        <FaqAccordion/>
      
      <FloatButton.BackTop 
        type='dark'
      />
    </div>
  );
});

export default Shop;