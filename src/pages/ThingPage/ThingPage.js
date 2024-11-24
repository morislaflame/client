import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOneThing } from '../../http/thingAPI';
import FaqAccordion from '../../components/FuctionalComponents/FaqAccordion/FaqAccordion';
import { Context } from '../../index';
import { FaShoppingCart, FaEdit } from 'react-icons/fa';
import { BASKET_ROUTE, EDIT_THING_ROUTE, LOGIN_ROUTE, TERMS_ROUTE } from '../../utils/consts';
import { observer } from 'mobx-react-lite';
import { message, Image, Carousel } from 'antd';
import OnlyIcon from '../../icons/onlyfans.png';
import MymIcon from '../../icons/Mym.png';
import FanslyIcon from '../../icons/fansly.png';
import BackButton from '../../components/BackButton/BackButton';
import { IoMdLock } from "react-icons/io";
import styles from './ThingPage.module.css';
import { FloatButton, Button, Spin } from 'antd';
import { LoadingOutlined } from "@ant-design/icons";

const ThingPage = observer(() => {
  const [thing, setThing] = useState({ info: {}, images: [], brands: [], type: {} });
  const [loading, setLoading] = useState(true);
  const [addingToBasket, setAddingToBasket] = useState(false); // Добавлено состояние для анимации загрузки
  const { id } = useParams();
  const { thing: thingStore, user } = useContext(Context);

  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  
    fetchOneThing(id).then(data => {
      setThing(data);
      setLoading(false);
    });
  
    // Only load the basket if the user is authenticated
    if (user.isAuth) {
      thingStore.loadBasket();
    }
  }, [id, thingStore, user.isAuth]); // Added user.isAuth to dependency array
  

  const handleAddToBasket = async () => {
    if (user.isAuth) {
      setAddingToBasket(true); // Устанавливаем состояние загрузки в true
      try {
        await thingStore.addToBasket(id);
        message.success('Added to cart');

        if (window.Telegram?.WebApp?.HapticFeedback) {
          window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        message.error('Error adding to cart: ' + errorMessage);
      } finally {
        setAddingToBasket(false); // Устанавливаем состояние загрузки в false после завершения запроса
      }
    } else {
      navigate(LOGIN_ROUTE);
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
        <BackButton />
        <h2 className={styles.topic}>{thing.name}</h2>
      </div>
      <div className={styles.main_model}>
        <div className={styles.photo}>
          <Carousel
            arrows
            className={styles.thing_carousel}
          >
            {thing.images.map((image, index) => (
              <div key={index}>
                <Image
                  className={styles.photos}
                  src={process.env.REACT_APP_API_URL + image.img}
                  alt={`Slide ${index + 1}`}
                  placeholder={<Image.PreviewGroup />}
                  width={'100%'}
                />
              </div>
            ))}
          </Carousel>
        </div>

        <div className={styles.description}>
          <div className={styles.brands_n_type}>
            <div className={styles.brands}>
              <span>Platforms available:</span>
              <div className={styles.brands_icons_container}>
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
            </div>
            {/* Отображение типа товара */}
            {thing.type && (
                <div className={styles.type_item}>
                  <span>Where she's from:</span>
                  <div className={styles.type}><span>{thing.type.name}</span></div>
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
              <div className={styles.info_str}><span>Does she need account access:</span> <div>{thing.info.girlmsg}</div></div>
              
            </div>
          )}
        </div>
      </div>
      


      {/* Условный рендеринг блока price_n_buy */}
      {thing.status === 'available' && thing.moderationStatus === 'approved' && (
        <div className={styles.price_n_buy}>
          <div className={styles.inside}>
            <span className={styles.price}>${thing.price}</span>
            <div className={styles.add_to_card}>
              <button
                className={styles.buy}
                onClick={handleAddToBasket}
                disabled={isInBasket || addingToBasket} // Блокируем кнопку, если товар уже в корзине или идет добавление
              >
                {addingToBasket ? <Spin indicator={<LoadingOutlined style={{color: 'white'}} spin />}/> : isInBasket ? 'Added' : 'Add to cart'}
              </button>
              <Button
                className={styles.shopping_card}
                type='text'
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
        <>
        <div className={styles.admin_info}>
          <h3>Admin Information</h3>
          <div style={{display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center'}}>
              <div className={styles.info_str}>
                      <span>Link:</span>
                      <div><a href={thing.info.link} target="_blank" rel="noopener noreferrer">{thing.info.link}</a></div>
                    </div>
              <div className={styles.info_str}>
                <span>Is Scout Model:</span> <div>{thing.isScoutModel ? 'Yes' : 'No'}</div>
              </div>
              {thing.isScoutModel && thing.scout && (
                <>
                  <div className={styles.info_str}>
                    <span>Scout ID:</span> <div>{thing.scout.id}</div>
                  </div>
                  <div className={styles.info_str}>
                    <span>Scout Username:</span> <div>{thing.scout.username}</div>
                  </div>
                </>
              )}
          </div>
            <Button
              type="primary"
              onClick={() => navigate(`${EDIT_THING_ROUTE}/${thing.id}`)}
              loading={loading} // Добавлено свойство loading
            >
              <FaEdit /> Edit model
            </Button>
        </div>
        </>
      )}


      <FloatButton.BackTop 
        type='dark'
      />
      <FaqAccordion className={styles.accord} />
    </div>
  );
});

export default ThingPage;
