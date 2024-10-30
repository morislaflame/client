import React, { Suspense } from 'react';
import './Main.css';
import { useNavigate } from 'react-router-dom';
import { SHOP_ROUTE } from '../../utils/consts';
import FaqAccordion from '../../components/FaqAccordion/FaqAccordion';
import { Skeleton } from 'antd';
import MyButton from '../../components/MyButton/MyButton';

const StorySlider = React.lazy(() => import('../../components/StorySlider/StorySlider'));
const Reviews = React.lazy(() => import('../../components/Reviews/Reviews'));
const ProductSlider = React.lazy(() => import('../../components/ProductSlider/ProductSlider'));

export default function Main() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(SHOP_ROUTE);
  };


  return (
    <div className='main'>
      <Suspense fallback={<Skeleton active />}>
        <StorySlider />
      </Suspense>
      <div className='mainPhoto'>
        <div className='mainArticle'>
          <h1>YOUR MODEL MARKETPLACE</h1>
          <h3>Here you can buy models for OnlyFans and other platforms (Please check available platforms on the creator's card)</h3>
        </div>
        <div className='skeleton'></div>
      </div>

      <div className='infoBox'>
        <div className='infoBar'>
          <div className='article'>
            <span>Our marketplace was created according to the expectations of our customers about reliability and quality</span>
          </div>
          <div className='perfomance'>
            <span>
            An agency cannot exist without models, and finding a responsible and honest content creator is usually expensive and time-consuming.
            Therefore, in order to reduce your costs for finding quality models, we have created a platform that makes it easy for you to find the right partner to earn money together <br />
              Welcome to <strong>THE MODEL'S HOTEL!</strong>
            </span>
          </div>
        </div>

        <div className='advantages'>
          <div className='advList'>
            <div className='advListTop'>
              <div className='pic'></div>
              <div className='art'></div>
              <h3>Convenience <br /> And Choice</h3>
            </div>
            <div className='txt'>
              <p>
              OnlyFans model marketplace offers a user-friendly interface that allows users to quickly find the models you are interested in using various filters.
              You can easily sort models by available platforms, countries and prices to find the perfect content for your preferences faster.
              </p>
            </div>
          </div>
          <div className='advList'>
            <div className='advListTop2'>
              <div className='art2'></div>
              <div className='pic2'></div>
              <h3>Credibility</h3>
            </div>
            <div className='txt'>
              <p>
              OnlyFans model marketplace provides reliability and safety of funds. With every purchase on the marketplace, there is a warranty period during which you can get your funds back.
              Even after the transaction is complete, customers have the option to exchange the model for another if something goes wrong, which provides additional protection and user satisfaction.
              </p>
            </div>
          </div>
        </div>
        <div className='go-shop'><MyButton text="Go to store" onClick={handleClick} /></div>
      </div>

      <Suspense fallback={<Skeleton active />}>
        <ProductSlider />
      </Suspense>

      <Suspense fallback={<Skeleton active />}>
        <Reviews />
      </Suspense>
      <h2 className='Faq'>FAQ</h2>
      <FaqAccordion />
    </div>
  );
}

