import React, { useContext, useEffect, Suspense } from 'react';
import styles from './Shop.module.css'
import ThingList from '../../components/ThingList';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { fetchBrands, fetchThings, fetchTypes } from '../../http/thingAPI';
import Pages from '../../components/Pages';
import StorySlider from '../../components/StorySlider/StorySlider';
import { FloatButton, Skeleton } from "antd";
import Reviews from '../../components/Reviews/Reviews';

// Используем React.lazy для ленивой загрузки компонентов
const SideBar = React.lazy(() => import('../../components/SideBar/SideBar'));
const FaqAccordion = React.lazy(() => import('../../components/FaqAccordion/FaqAccordion'));
const ReviewsLazy = React.lazy(() => import('../../components/Reviews/Reviews'));

const Shop = observer(() => {
  const {thing} = useContext(Context)

  useEffect(() => {
    const savedPage = sessionStorage.getItem('currentPage');
    if (savedPage) {
      thing.setPage(Number(savedPage));
    }

    fetchTypes().then(data => thing.setTypes(data));
    fetchBrands().then(data => thing.setBrands(data));
    fetchThings(null, null, thing.page, 20).then(data => {
      thing.setThings(data.rows);
      thing.setTotalCount(data.count);
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
          <ThingList/>
          <Pages/>
      </div>
      <Suspense fallback={<Skeleton active />}>
        <Reviews/>
        <h2 style={{color: 'white', marginTop: '15px'}}>FAQ</h2>
        <FaqAccordion/>
      </Suspense>
      <FloatButton.BackTop 
        type='dark'
      />
    </div>
  );
});

export default Shop;