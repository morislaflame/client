import React, { useContext, useEffect } from 'react';
import { Context } from '../../index';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa'; // Импорт иконки пользователя
import { LOGIN_ROUTE, ADMIN_ROUTE, BASKET_ROUTE, USER_ACCOUNT_ROUTE } from '../../utils/consts'; // Добавляем USER_ACCOUNT_ROUTE
import './NavBar.css';
import { FaTelegram } from "react-icons/fa6";

const NavBar = observer(() => {
    const { user, thing } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        thing.loadBasket(); // Загружаем корзину при первой загрузке
    }, [thing]);

    const logOut = () => {
        thing.resetBasket();
        user.logout(); // Используем метод logout для выхода из аккаунта
        navigate(LOGIN_ROUTE); // Перенаправляем на страницу авторизации после выхода
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary" style={{ justifyContent: 'center' }}>
            {user.isAuth ? (
                <div className='navbar'>
                    <Navbar.Brand href="/">Model's Hotel</Navbar.Brand>
                    
                    <div className='menu'>
                        <Button
                            className='shopping-cart'
                            variant="outline-dark"
                            onClick={() => navigate(BASKET_ROUTE)}
                            style={{ position: 'relative' }} // Для позиционирования значка количества товаров
                        >
                            <FaShoppingCart size={24} />
                            {thing.basket.length > 0 && (
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        backgroundColor: 'red',
                                        color: 'white',
                                        borderRadius: '50%',
                                        padding: '4px 6px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        lineHeight: '1',
                                    }}
                                >
                                    {thing.basket.length}
                                </span>
                            )}
                        </Button>
                        <Button
                            className='user-account'
                            variant="outline-dark"
                            onClick={() => navigate(USER_ACCOUNT_ROUTE)} // Переход на страницу аккаунта пользователя
                        >
                            <FaUser size={24} />
                        </Button>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                    </div>
                    
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '160px' }}
                            navbarScroll
                        >
                            <Nav.Link href='https://t.me/themodelshotel' style={{ display: 'flex', gap: '5px', alignItems: 'center', color: 'black' }}>
                                <FaTelegram /> Us in Telegram
                            </Nav.Link>
                            <Nav.Link href="/shop">Store</Nav.Link>
                            <Nav.Link href="/privacy">Privacy Policy</Nav.Link>
                            <Nav.Link href="/terms">Terms Of Service</Nav.Link>
                        </Nav>
                        <div className="d-flex" style={{ justifyContent: 'flex-end' }}>
                            {/* Кнопка "Админка", показывается только если роль ADMIN */}
                            {user.user.role === 'ADMIN' && (
                                <Button
                                    variant="outline-danger"
                                    style={{ marginRight: '12px' }}
                                    onClick={() => navigate(ADMIN_ROUTE)}
                                >
                                    Админка
                                </Button>
                            )}
                            <Button 
                                variant="outline-danger" 
                                onClick={logOut}>
                                Выйти
                            </Button>
                        </div>
                    </Navbar.Collapse>
                </div>
            ) : (
                <Button variant="outline-danger" onClick={() => navigate(LOGIN_ROUTE)}>
                    Авторизация
                </Button>
            )}
        </Navbar>
    );
});

export default NavBar;
