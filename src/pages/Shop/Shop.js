import React, { useContext, useEffect, Suspense } from 'react';
import styles from './Shop.module.css'
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { fetchAdultPlatforms, fetchCountries } from '../../http/modelProductAPI';
import Pages from '../../components/ShopComponents/Pages/Pages';
import StorySlider from '../../components/ShopComponents/StorySlider/StorySlider';
import { FloatButton, Skeleton } from "antd";
import FaqAccordion from '../../components/FuctionalComponents/FaqAccordion/FaqAccordion';

const SideBar = React.lazy(() => import('../../components/ShopComponents/SideBar/SideBar'));
const Reviews = React.lazy(() => import('../../components/MainComponents/Reviews/Reviews'));
const ModelList = React.lazy(() => import('../../components/ShopComponents/ModelList/ModelList'));

const Shop = observer(() => {
  const {model} = useContext(Context);

  useEffect(() => {
    window.scrollTo(0, 0);
    const savedPage = sessionStorage.getItem('currentPage');
    if (savedPage) {
      model.setPage(Number(savedPage));
    }

    fetchCountries().then(data => model.setCountries(data));
    fetchAdultPlatforms().then(data => model.setAdultPlatforms(data));
  }, [model]);

  useEffect(() => {
    sessionStorage.setItem('currentPage', model.page);
  }, [model.page]);

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
      <div className="container">
        <Suspense fallback={<Skeleton active />}>
          <ModelList/>
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
