import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchModelProductById } from '../../http/modelProductAPI';
import FaqAccordion from '../../components/FuctionalComponents/FaqAccordion/FaqAccordion';
import { Context } from '../../index';
import { FaEdit } from 'react-icons/fa';
import { IoMdHeart } from 'react-icons/io';
import { BASKET_ROUTE, EDIT_THING_ROUTE, LOGIN_ROUTE, TERMS_ROUTE, SELLER_INFO_ROUTE, ORDER_ROUTE } from '../../utils/consts';
import { observer } from 'mobx-react-lite';
import { message, Image, Carousel } from 'antd';
import OnlyIcon from '../../icons/onlyfans.png';
import MymIcon from '../../icons/Mym.png';
import FanslyIcon from '../../icons/fansly.png';
import BackButton from '../../components/UI/BackButton/BackButton';
import { IoMdLock } from "react-icons/io";
import styles from './ModelPage.module.css';
import { FloatButton, Button, Spin } from 'antd';
import { LoadingOutlined } from "@ant-design/icons";
import { playHeartAnimation } from '../../components/Animations/HeartAnimation';

const ModelPage = observer(() => {
  const [models, setModels] = useState({ info: {}, images: [], adultPlatforms: [], country: {} });
  const [loading, setLoading] = useState(true);
  const [addingToBasket, setAddingToBasket] = useState(false); // Добавлено состояние для анимации загрузки
  const [heartAnimation, setHeartAnimation] = useState(false);
  const { id } = useParams();
  const { model, user, order } = useContext(Context);

  const navigate = useNavigate();

  // Добавляем ref для сердечка
  const heartRef = useRef(null);

  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  
    fetchModelProductById(id).then(data => {
      setModels(data);
      setLoading(false);
    });
  
    // Only load the basket if the user is authenticated
    if (user.isAuth) {
      model.loadBasket();
    }
  }, [id, model, user.isAuth]); // Added user.isAuth to dependency array
  
  const handleCreateOrder = async () => {
    if (!user.isAuth) {
      navigate(LOGIN_ROUTE);
      return;
    }

    setAddingToBasket(true);
    try {
      const newOrder = await order.createOrder({
        modelProductId: id,
        chatId: id,
      });

      if (newOrder?.id) {
        if (window.Telegram?.WebApp?.HapticFeedback) {
          window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        navigate(`${ORDER_ROUTE}/${newOrder.id}`);
      }
    } catch (error) {
      console.error('Error payload:', error.response?.data);
      message.error('Error creating order: ' + (error.response?.data?.message || error.message));
    } finally {
      setAddingToBasket(false);
    }
  };

  const handleAddToFavorites = async () => {
    if (!user.isAuth) {
        navigate(LOGIN_ROUTE);
        return;
    }

    setHeartAnimation(true);
    
    // Используем импортированную анимацию
    playHeartAnimation(heartRef);

    try {
        const basketItem = model.basket.find(item => item.modelProductId === Number(id));
        
        if (basketItem) {
            await model.removeFromBasket(basketItem.id);
            message.success('Removed from favorites');
        } else {
            await model.addToBasket(id);
            message.success('Added to favorites');
        }

        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        message.error('Error: ' + errorMessage);
    } finally {
        setTimeout(() => setHeartAnimation(false), 1000);
    }
  };

  // Проверяем, находится ли товар в корзине
  const isInBasket = model.isItemInBasket(id);

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
        <BackButton style={{padding: '0'}}/>
        <h2 className={styles.topic}>{models.name}</h2>
      </div>
      <div className={styles.main_model}>
        <div className={styles.photo}>
          <Carousel
            arrows
            className={styles.thing_carousel}
          >
            {models.images.map((image, index) => (
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
                {models.adultPlatforms && models.adultPlatforms.length > 0 ? (
                  models.adultPlatforms.map(adultPlatform => (
                    <div
                      key={adultPlatform.id}
                      style={brandStyles[adultPlatform.id] || { color: 'black' }}
                      className={styles.brand_item}
                    >
                      {brandIcons[adultPlatform.id] && (
                        <img
                          src={brandIcons[adultPlatform.id]}
                          alt={`${adultPlatform.name} icon`}
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
            {models.country && (
                <div className={styles.type_item}>
                  <span>Where she's from:</span>
                  <div className={styles.type}><span>{models.country.name}</span></div>
                </div>
              )}
          </div>
          {models.info && (
            <div className={styles.des_str}>
              
              <div className={styles.info_str}><span>Age:</span> <div>{models.info.age}</div></div>
              <div className={styles.info_str}><span>Smartphone:</span> <div>{models.info.smartphone}</div></div>
              <div className={styles.info_str}><span>% For Her:</span> <div>{models.info.percent}</div></div>
              <div className={styles.info_str}><span>Time Per Day (hours):</span> <div>{models.info.time}</div></div>
              <div className={styles.info_str}><span>English Skills (1-10):</span> <div>{models.info.english}</div></div>
              <div className={styles.info_str}><span>Content:</span> <div>{models.info.content}</div></div>
              <div className={styles.info_str}><span>When Can She Start:</span> <div>{models.info.start}</div></div>
              <div className={styles.info_str}><span>Social Media Set Up:</span> <div>{models.info.socialmedia}</div></div>
              <div className={styles.info_str}><span>Comfortable With TikTok:</span> <div>{models.info.tiktok}</div></div>
              <div className={styles.info_str}><span>Any Countries Blocked?:</span> <div>{models.info.cblocked}</div></div>
              <div className={styles.info_str}><span>OF Verified:</span> <div>{models.info.ofverif}</div></div>
              <div className={styles.info_str}><span>Contract Signed:</span> <div>{models.info.contract}</div></div>
              <div className={styles.info_str}><span>Does she need account access:</span> <div>{models.info.girlmsg}</div></div>
              
            </div>
          )}
          
          {models.seller && (
            <div className={styles.seller_info}>
              <h4>Продавец:</h4>
              <Button 
                onClick={() => navigate(`${SELLER_INFO_ROUTE}/${models.seller.id}`)}
                type="link"
                className={styles.seller_link}
              >
                {models.seller.sellerInformation?.sellerName || 'Неизвестный продавец'}
                <span className="ms-2">→</span>
              </Button>
            </div>
          )}
        </div>
        <div className={styles.price_n_buy}>
          <div className={styles.inside}>
            <span className={styles.price}>${models.priceUSD}</span>
            {models.status === 'AVAILABLE' && models.moderationStatus === 'APPROVED' && (
            <div className={styles.add_to_card}>
              <button
                className={styles.buy}
                onClick={handleCreateOrder}
                disabled={addingToBasket}
              >
                {addingToBasket ? (
                  <Spin indicator={<LoadingOutlined style={{color: 'white'}} spin />}/>
                ) : (
                  'Create Order'
                )}
              </button>
              <Button
                className={styles.shopping_card}
                type='text'
                onClick={handleAddToFavorites}
                style={{ height: '100%', padding: '0 var(--main-padding)' }}
              >
                <div ref={heartRef}>
                {isInBasket ? (
                      <IoMdHeart 
                        style={{
                          color: '#ff0000', 
                          fontSize: 'calc(var(--index) * 3.5)'
                        }}
                      />
                    ) : (
                      <IoMdHeart 
                        style={{
                          color: 'var(--color-text)',
                          fontSize: 'calc(var(--index) * 3.5)'
                        }}
                      />
                    )}
                </div>
              </Button>
            </div>
            )}
          </div>
          
          <div className={styles.warranty} onClick={() => navigate(TERMS_ROUTE)}>
            <span>14-days warranty</span> <IoMdLock className={styles.btn_icn}/>
          </div>
          
        </div>

      </div>
      {/* Кнопка редактирования для администратора */}
      {isAdmin && (
        <>
        <div className={styles.admin_info}>
          <h3>Admin Information</h3>
          <div style={{display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center'}}>
              <div className={styles.info_str}>
                      <span>Link:</span>
                      <div><a href={models.info.link} target="_blank" rel="noopener noreferrer">{models.info.link}</a></div>
                    </div>
          </div>
            <Button
              type="primary"
              onClick={() => navigate(`${EDIT_THING_ROUTE}/${models.id}`)}
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

export default ModelPage;
