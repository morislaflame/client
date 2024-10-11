import React, { useEffect, useState, useContext } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOneThing } from '../../http/thingAPI';
import FaqAccordion from '../../components/FaqAccordion/FaqAccordion';
import { Context } from '../../index';
import { FaShoppingCart, FaEdit } from 'react-icons/fa';
import { Button } from 'react-bootstrap';
import { BASKET_ROUTE, EDIT_THING_ROUTE, LOGIN_ROUTE, SHOP_ROUTE, TERMS_ROUTE } from '../../utils/consts';
import { observer } from 'mobx-react-lite';
import { message } from 'antd';
import OnlyIcon from '../../icons/onlyfans.png';
import MymIcon from '../../icons/Mym.png'
import FanslyIcon from '../../icons/fansly.png'
import BackButton from '../../components/BackButton/BackButton';
import { IoMdLock } from "react-icons/io";
import styles from './ThingPage.module.css'

const ThingPage = observer(() => {
  const [thing, setThing] = useState({ info: {}, images: [], brands: [], type: {} });
  const { id } = useParams();
  const { thing: thingStore, user } = useContext(Context);

  const navigate = useNavigate();


  useEffect(() => {
    // Прокрутка страницы вверх при монтировании компонента
    window.scrollTo({ top: 0, behavior: 'smooth' });

    fetchOneThing(id).then(data => setThing(data));
    thingStore.loadBasket();
  }, [id, thingStore]);

  const handleAddToBasket = async () => {
    if (user.isAuth) {
      try {
        await thingStore.addToBasket(id);
        message.success('Added to cart');
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        message.error('Error adding to cart: ' + errorMessage);
      }
    } else {
      navigate(LOGIN_ROUTE)
    }
    
  };

  // Проверяем, находится ли товар в корзине
  const isInBasket = thingStore.isItemInBasket(id);

  // Проверяем, является ли пользователь администратором
  const isAdmin = user.isAuth && user.user.role === 'ADMIN';

  const brandStyles = {
    1: { color: '#008ccf' },
    2: { color: '#1fa7df' },
    3: { color: '#e8642c' }
  };

  const brandIcons = {
    1: OnlyIcon,
    2: FanslyIcon,
    3: MymIcon
  };


  return (
    <div className={styles.thing_content}>
      <div className={styles.topic_back}>
        <BackButton/>
        <h2 className={styles.topic}>{thing.name}</h2>
      </div>
      <div className={styles.main_model}>
        <div className={styles.photo}>
          <Carousel data-bs-theme="dark" className={styles.thing_carousel}>
            {thing.images.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  className={styles.photos}
                  src={process.env.REACT_APP_API_URL + image.img}
                  alt={`Slide ${index + 1}`}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        <div className={styles.description}>
          <div className={styles.brands}>
            {thing.brands && thing.brands.length > 0 ? (
              thing.brands.map(brand => (
                <div
                  key={brand.id}
                  style={brandStyles[brand.id] || { color: 'black' }}
                  className={styles.brand_item}
                >
                  {brandIcons[brand.id] && (
                    <img
                      src={brandIcons[brand.id]}
                      alt={`${brand.name} icon`}
                      className={styles.brands_icons}
                    />
                  )}
                </div>
              ))
            ) : (
              <div>Unknown Brand</div>
            )}
          </div>
          {/* Отображение типа товара */}
          <div className={styles.thing_type}>
            {thing.type && (
              <div className={styles.type_item}>
                {/* {typeIcons[thing.type.id] && (
                  <span className="type-icon">{typeIcons[thing.type.id]}</span>
                )} */}
                <div className={styles.info_str}><span>Origin:</span> <div>{thing.type.name}</div></div>
              </div>
            )}
          </div>
          {thing.info && (
            <div className={styles.des_str}>
              <div className={styles.info_str}><span>Age:</span> <div>{thing.info.age}</div></div>
              <div className={styles.info_str}><span>Smartphone:</span> <div>{thing.info.smartphone}</div></div>
              <div className={styles.info_str}><span>% For Her:</span> <div>{thing.info.percent}</div></div>
              <div className={styles.info_str}><span>Time Per Day (hours):</span> <div>{thing.info.time}</div></div>
              <div className={styles.info_str}><span>English Skills (1-10):</span> <div>{thing.info.english}</div></div>
              <div className={styles.info_str}><span>Content:</span> <div>{thing.info.content}</div></div>
              <div className={styles.info_str}><span>When Can She Start:</span> <div>{thing.info.start}</div></div>
              <div className={styles.info_str}><span>Social Media Set Up:</span> <div>{thing.info.socialmedia}</div></div>
              <div className={styles.info_str}><span>Comfortable With TikTok:</span> <div>{thing.info.tiktok}</div></div>
              <div className={styles.info_str}><span>Any Countries Blocked?:</span> <div>{thing.info.cblocked}</div></div>
              <div className={styles.info_str}><span>OF Verified:</span> <div>{thing.info.ofverif}</div></div>
              <div className={styles.info_str}><span>Contract Signed:</span> <div>{thing.info.contract}</div></div>
            </div>
          )}
        </div>
      </div>

      {/* Условный рендеринг блока price_n_buy */}
      {thing.status !== 'purchased' && (
        <div className={styles.price_n_buy}>
          <div className={styles.inside}>
            <span className={styles.price}>${thing.price}</span>
            <div className={styles.add_to_card}>
              <button className={styles.buy} onClick={handleAddToBasket} disabled={isInBasket}>
                {isInBasket ? 'Added' : 'Add to cart'}
              </button>
              <Button
                className={styles.shopping_card}
                variant="outine-light"
                onClick={() => navigate(BASKET_ROUTE)}
                style={{ height: '100%' }}
              >
                <FaShoppingCart size={28} />
              </Button>
            </div>
          </div>
          
          <div className={styles.warranty} onClick={() => navigate(TERMS_ROUTE)}>
            <span>14-days warranty</span> <IoMdLock className={styles.btn_icn}/>
          </div>
        </div>
      )}

      {/* Кнопка редактирования для администратора */}
      {isAdmin && (
        <div className={styles.admin_actions}>
          <Button
            variant="primary"
            onClick={() => navigate(`${EDIT_THING_ROUTE}/${thing.id}`)}
          
          >
            <FaEdit /> Редактировать данные
          </Button>
        </div>
      )}

      <FaqAccordion className={styles.accord} />
    </div>
  );
});

export default ThingPage;