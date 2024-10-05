import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById } from '../../http/userAPI';
import ListGroup from 'react-bootstrap/ListGroup';
import BackButton from '../../components/BackButton/BackButton';
import styles from '../UserAccount/UserAccount.module.css'
import { message } from 'antd';
import Slider from 'react-slick';
import { FcCancel, FcClock, FcOk } from "react-icons/fc";
import { GiHighHeel } from "react-icons/gi";

const UserInfoPage = () => {
    const { id } = useParams(); // Получаем id пользователя из URL
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUserById(id); // Получаем информацию о пользователе по id
                setUser(data);
                setLoading(false);
            } catch (error) {
                message.error('Error fetching user data:', error)
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };
        fetchUserData();
    }, [id]);

    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        autoplay: false,
        slidesToShow: 1,
        arrows: false,
        centerMode: true,
        centerPadding: "20px",
        focusOnSelect: true,
        adaptiveHeight: true,
        appendDots: dots => (
            <div
              style={{
                color: 'white',
                borderRadius: "10px",
                padding: "10px"
              }}
            >
              <ul style={{ margin: "0px" }}> {dots} </ul>
            </div>
          ),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div className={styles.user_info}>
            <div className={styles.topic_back}>
                <BackButton/>
                <h2>User Info</h2>
            </div>
            <div className={styles.user}>
                <p>Email: {user.email}</p>
                <p>Роль: {user.role}</p>
                <p>ID: {user.id}</p>
            </div>
            
            <h3>Корзина</h3>
            {user.basket && user.basket.basket_things.length > 0 ? (
                <div className={styles.basket}>
                    {user.basket.basket_things.map(basketThing => (
                        <div key={basketThing.id}>
                            <span>{basketThing.thing.name}</span> — <span>${basketThing.thing.price}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Корзина пуста</p>
            )}
            

            <h3>Заказы</h3>
            {user.orders.length > 0 ? (
                <Slider {...sliderSettings} className={styles.slider}>
                {user.orders.map(order => (
                    <div className={styles.order_list} key={order.id}>
                        <div className={styles.order_item}>
                            <div className={styles.order_status}>
                                <span>Order №{order.id}</span>
                            </div>
                            <div className={styles.order_details}>
                                <div className={styles.ladies}>
                                    {order.order_things.map(item => (
                                        <div className={styles.name_price} key={item.id}>
                                            <div className={styles.name_heel}>
                                                <GiHighHeel />
                                                model: <b>{item.thing.name}</b>
                                            </div>
                                            <span>${item.thing.price}</span>
                                        </div>
                                    ))}
                                </div>
                                {order.promo_code !== null && (
                                    <div className={styles.promocode_status}>
                                        Promocode: {order.promo_code.code} ${order.promo_code.discountValue}
                                    </div>
                                )}
                                <div className={styles.total_price}>Total: ${order.totalPrice} </div>
                                <div className={styles.mini_status}>

                                    {order.status === 'created' && (
                                        <div className={styles.approved}><FcClock style={{ color: 'black' }} /><p>Your order is pending confirmation</p></div>
                                    )}
                                    {order.status === 'paid' && (
                                        <div className={styles.approved}><FcOk /><span>Successfully paid</span></div>
                                    )}
                                    {order.status === 'rejected' && (
                                        <div className={styles.approved}><FcCancel /><p>The order was rejected</p></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
            ) : (
                <p>Нет заказов</p>
            )}

            

            <h3>Возвраты</h3>
            {user.returns && user.returns.length > 0 ? (
                <Slider {...sliderSettings} className={styles.slider}>
                    {user.returns.map(returnItem => (
                        <div className={styles.order_list} key={returnItem.id}>
                            <div className={styles.order_item}>
                                <div className={styles.order_status}>
                                    <span>Return №{returnItem.id}</span>
                                </div>
                                <div className={styles.return_details}>
                                    <div className={styles.ladies}>
                                        <div className={styles.name_price}>
                                            <div className={styles.name_heel}>
                                                <GiHighHeel />
                                                model: {returnItem.thing.name}
                                            </div>
                                            <span>${returnItem.thing.price}</span>
                                        </div>
                                    </div>
                                    <div className={styles.mini_status_return}>
                                        {returnItem.status === 'pending' && (
                                            <div className={styles.approved}><FcClock style={{ color: 'black' }} /><p>The refund request is being reviewed</p></div>
                                        )}
                                        {returnItem.status === 'approved' && (
                                            <div className={styles.approved}><FcOk /><p>Refund confirmed</p></div>
                                        )}
                                        {returnItem.status === 'rejected' && (
                                            <div className={styles.approved}><FcCancel /><p>Refund denied</p></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            ) : (
                <p>Нет возвратов</p>
            )}

            <div className={styles.exchanges}>
                <h3>Обмены</h3>
                {user.exchangeRequests && user.exchangeRequests.length > 0 ? (
                     <Slider {...sliderSettings} className={styles.slider}>
                    
                        {user.exchangeRequests.map(exchange => (
                            <div className={styles.order_list}>
                            <div className={styles.exchange_item} key={exchange.id}>
                                <div className={styles.exchange_status}>
                                    <span>Exchange №{exchange.id}</span>
                                    {/* <span> {exchange.status}</span> */}
                                </div>
                                <div className={styles.exchange_details}>
                                    <div className={styles.old_new}>
                                        <div className={styles.old_new_names}>
                                            <div><strong>Swapped:</strong></div> {exchange.OldThing.name} - ${exchange.OldThing.price}
                                        </div>
                                        <div className={styles.old_new_names}>
                                            <div><strong>For:</strong></div> {exchange.NewThing.name} - ${exchange.NewThing.price}
                                        </div>
                                    </div>

                                    <div>
                                        <strong>Price Difference:</strong> ${exchange.priceDifference}
                                    </div>
                                    <div className={styles.mini_status}>
                                        {exchange.status === 'pending' && (
                                            <div className={styles.approved}><FcClock style={{ color: 'black' }} /><p>Your exchange request is being processed</p></div>
                                        )}
                                        {exchange.status === 'approved' && (
                                            <div className={styles.approved}><FcOk /><p>Approved</p></div>
                                        )}
                                        {exchange.status === 'rejected' && (
                                            <div className={styles.approved}><FcCancel /><p>Denied</p></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            </div>
                        ))}
                    
                    </Slider>
                ) : (
                    <p>Нет обменов</p>
                )}
            </div>
        </div>
    );
};

export default UserInfoPage;
