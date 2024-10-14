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
      <Suspense fallback={"Loading..."}>
        <StorySlider />
      </Suspense>
      <div className='mainPhoto'>
        <div className='mainArticle'>
          <h1>EXPRESS MODEL MARKETPLACE</h1>
          <h3>Here you can buy models for OnlyFans and other platforms (please check “platforms available” section)</h3>
        </div>
        <div className='skeleton'></div>
      </div>

      <div className='infoBox'>
        <div className='infoBar'>
          <div className='article'>
            <span>Наш Маркетплейс создавался в соответствии с ожиданиями клиентов о надежности и качестве</span>
          </div>
          <div className='perfomance'>
            <span>
              Агентство не может существовать без моделей, а поиск ответственного и честного создателя контента обычно выходит дорого и долго.
              Поэтому, чтобы сократить ваши издержки на поиск качественных моделей, мы создали площадку, позволяющую легко отыскать нужного вам партнера. <br />
              Встречайте - <strong>THE MODEL'S HOTEL!</strong>
            </span>
          </div>
        </div>

        <div className='advantages'>
          <div className='advList'>
            <div className='advListTop'>
              <image className='pic'></image>
              <div className='art'></div>
              <h3>Удобство <br /> И Выбор</h3>
            </div>
            <div className='txt'>
              <p>
                Маркетплейс моделей OnlyFans предлагает удобный интерфейс, позволяющий пользователям быстро находить интересующих их моделей с помощью различных фильтров.
                Вы можете легко сортировать модели по категориям, популярности, ценам и другим параметрам, чтобы быстрее найти идеальный контент для своих предпочтений.
              </p>
            </div>
          </div>
          <div className='advList'>
            <div className='advListTop2'>
              <div className='art2'></div>
              <image className='pic2'></image>
              <h3>Надежность</h3>
            </div>
            <div className='txt'>
              <p>
                Маркетплейс моделей OnlyFans обеспечивает надежность использования благодаря гаранту, который хранит деньги до полного исполнения обязательств.
                Даже после завершения сделки у клиентов есть возможность обменять модель на другую, если что-то пойдет не так, что обеспечивает дополнительную защиту и удовлетворение пользователей.
              </p>
            </div>
          </div>
        </div>
        <div className='go-shop'><MyButton text="Go to store" onClick={handleClick} /></div>
      </div>

      <Suspense fallback={"Loading..."}>
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

