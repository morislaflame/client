import React from 'react';
import './Main.css';
import ProductSlider from '../../components/ProductSlider/ProductSlider';
import StorySlider from '../../components/StorySlider/StorySlider';
import MyButton from '../../components/MyButton/MyButton';
import FaqAccordion from '../../components/FaqAccordion/FaqAccordion';
import { useNavigate } from 'react-router-dom';
import { SHOP_ROUTE } from '../../utils/consts';

export default function Main() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(SHOP_ROUTE);
      };

  return (
    <div className='main'>
        <StorySlider /> {/* Добавляем компонент ProductSlider */} 
        <div className='mainPhoto'>
            <div className='mainArticle'>
                <h1>THE MODEL'S HOTEL</h1>
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
                    <span>Агентство не может существовать без моделей, а поиск ответственного и честного создателя контента обычно выходит дорого и
                        долго. Поэтому, чтобы сократить ваши издержки на поиск качественных моделей, мы создали площадку, позволяющую легко отыскать 
                        нужного вам партнера. <br/>
                         Встречайте - <strong>THE MODEL'S HOTEL!</strong>
                    </span>
                </div>
            </div>
            
            <div className='advantages'>
                <div className='advList'>
                    <div className='advListTop'>
                        <image className='pic'></image>
                        <div className='art'></div>
                        <h3>Удобство <br/> И Выбор</h3>
                    </div>
                    <div className='txt'>
                        <p>
                            Маркетплейс моделей OnlyFans предлагает удобный интерфейс, 
                            позволяющий пользователям быстро находить интересующих их моделей с помощью различных фильтров. 
                            Вы можете легко сортировать модели по категориям, популярности, ценам и другим параметрам, 
                            чтобы быстрее найти идеальный контент для своих предпочтений.
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
                            Маркетплейс моделей OnlyFans обеспечивает надежность использования благодаря гаранту, 
                            который хранит деньги до полного исполнения обязательств. Даже после завершения сделки у клиентов есть возможность 
                            обменять модель на другую, если что-то пойдет не так, что обеспечивает дополнительную защиту 
                            и удовлетворение пользователей.
                        </p>
                    </div>
                </div>
            </div>
            <div className='go-shop'><MyButton text="Перейти в магазин" onClick={handleClick} /></div>
        </div>
        <ProductSlider /> {/* Добавляем компонент ProductSlider */}
        <h2 className='Faq'>FAQ</h2>
        <FaqAccordion />
    </div>
  )
}
