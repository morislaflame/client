import React, { useState } from 'react';
import './Main.css';
import ProductSlider from '../../components/ProductSlider/ProductSlider';
import StorySlider from '../../components/StorySlider/StorySlider';
import MyButton from '../../components/MyButton/MyButton';
import FaqAccordion from '../../components/FaqAccordion/FaqAccordion';
import { useNavigate } from 'react-router-dom';
import { SHOP_ROUTE } from '../../utils/consts';
import Reviews from '../../components/Reviews/Reviews';
import { useInView } from 'react-intersection-observer';

export default function Main() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(SHOP_ROUTE);
  };

  // Используем useInView для отслеживания видимости ProductSlider
  const { ref, inView } = useInView({
    threshold: 0.1, // Загрузка при 10% видимости
  });

  const [isProductSliderLoaded, setProductSliderLoaded] = useState(false);

  // Загружаем ProductSlider только при первом попадании в область видимости
  if (inView && !isProductSliderLoaded) {
    setProductSliderLoaded(true);
  }

  return (
    <div className='main'>
      <StorySlider />
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

      {/* Используем ref для отслеживания видимости ProductSlider */}
      <div ref={ref}>
        {isProductSliderLoaded && <ProductSlider />} {/* Загружаем ProductSlider только если он был загружен */}
      </div>

      <Reviews />
      <h2 className='Faq'>FAQ</h2>
      <FaqAccordion />
    </div>
  );
}
