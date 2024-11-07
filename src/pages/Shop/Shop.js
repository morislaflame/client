import React, { useContext, useEffect, Suspense } from 'react';
import styles from './Shop.module.css'
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { fetchBrands, fetchTypes } from '../../http/thingAPI';
import Pages from '../../components/Pages';
import StorySlider from '../../components/StorySlider/StorySlider';
import { FloatButton, Skeleton } from "antd";
import FaqAccordion from '../../components/FaqAccordion/FaqAccordion';

const SideBar = React.lazy(() => import('../../components/SideBar/SideBar'));
const Reviews = React.lazy(() => import('../../components/Reviews/Reviews'));
const ThingList = React.lazy(() => import('../../components/ThingList'));

const Shop = observer(() => {
  const {thing} = useContext(Context);

  useEffect(() => {
    window.scrollTo(0, 0);
    const savedPage = sessionStorage.getItem('currentPage');
    if (savedPage) {
      thing.setPage(Number(savedPage));
    }

    fetchTypes().then(data => thing.setTypes(data));
    fetchBrands().then(data => thing.setBrands(data));
  }, [thing]);

  useEffect(() => {
    sessionStorage.setItem('currentPage', thing.page);
  }, [thing.page]);

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
          <ThingList/>
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
        duration={100}
      />
    </div>
  );
});

export default Shop;
