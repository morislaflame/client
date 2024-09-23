import React, { useContext, useEffect } from 'react';
import { Context } from '../../index';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUserAlt  } from 'react-icons/fa';
import { LOGIN_ROUTE, ADMIN_ROUTE, BASKET_ROUTE, USER_ACCOUNT_ROUTE } from '../../utils/consts';
import './NavBar.css';
import { FaTelegram } from "react-icons/fa6";
import styled from 'styled-components'

const NavBar = observer(() => {
    const { user, thing } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (user.isAuth) {
            thing.loadBasket(); // Загружаем корзину только если пользователь авторизован
        }
    }, [user.isAuth, thing]);

    const logOut = () => {
        thing.clearBasket(); // Используем метод clearBasket для очистки корзины
        user.logout(); // Выходим из аккаунта
        navigate(LOGIN_ROUTE); // Перенаправляем на страницу авторизации
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="bg-body-tertiary" style={{ justifyContent: 'center' }}>
            <div className='navbar'>
                <Navbar.Brand href="/" style={{color: 'white'}}>Model's Hotel</Navbar.Brand>
                
                <div className='menu'>
                    {user.isAuth && (
                        <>
                            <Button
                                className='shopping-cart'
                                variant="outline-light"
                                onClick={() => navigate(BASKET_ROUTE)}
                                style={{ position: 'relative' }}
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
                                variant="outline-light"
                                onClick={() => navigate(USER_ACCOUNT_ROUTE)}
                            >
                                <FaUserAlt size={24} />
                            </Button>
                        </>
                    )}
                    <Navbar.Toggle aria-controls="navbarScroll" data-bs-theme="dark"  style={{color: 'white'}}/>
                </div>
                
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '160px', color: 'white' }}
                        navbarScroll
                    >
                        <Nav.Link href='https://t.me/themodelshotel' style={{ display: 'flex', gap: '5px', alignItems: 'center', color: 'white' }}>
                            <FaTelegram /> Us in Telegram
                        </Nav.Link>
                        <Nav.Link href="/shop" style={{ color: 'white' }}>Store</Nav.Link>
                        <Nav.Link href="/privacy" style={{ color: 'white' }}>Privacy Policy</Nav.Link>
                        <Nav.Link href="/terms" style={{ color: 'white' }}>Terms of Service</Nav.Link>
                    </Nav>
                    <div className="d-flex" style={{ justifyContent: 'flex-end' }}>
                        {user.isAuth ? (
                            <>
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
                            </>
                        ) : (
                            <Button variant="outline-danger" onClick={() => navigate(LOGIN_ROUTE)}>
                                Авторизация
                            </Button>
                        )}
                    </div>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
});

export default NavBar;
