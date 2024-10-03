import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById } from '../../http/userAPI';
import ListGroup from 'react-bootstrap/ListGroup';
import BackButton from '../../components/BackButton/BackButton';
import styles from './UserInfoPage.module.css'
import { message } from 'antd';
import Slider from 'react-slick';
import { FcCancel, FcClock, FcOk } from "react-icons/fc";

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
            

            <h3>Заказы</h3>
            {user.orders.length > 0 ? (
                <ListGroup>
                    {user.orders.map(order => (
                        <ListGroup.Item key={order.id}>
                            Заказ #{order.id} — Статус: {order.status}
                            <ul>
                                {order.order_things.map(thing => (
                                    <li key={thing.id}>{thing.thing.name} — ${thing.thing.price}</li>
                                ))}
                            </ul>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <p>Нет заказов</p>
            )}

            <h3>Корзина</h3>
            {user.basket && user.basket.basket_things.length > 0 ? (
                <ListGroup>
                    {user.basket.basket_things.map(basketThing => (
                        <ListGroup.Item key={basketThing.id}>
                            {basketThing.thing.name} — ${basketThing.thing.price}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <p>Корзина пуста</p>
            )}

            <h3>Возвраты</h3>
            {user.returns.length > 0 ? (
                <ListGroup>
                    {user.returns.map(returnRequest => (
                        <ListGroup.Item key={returnRequest.id}>
                            Товар: {returnRequest.thing.name} — Причина возврата: {returnRequest.reason}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
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
