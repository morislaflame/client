import React, { useContext, useEffect } from 'react';
import { Context } from '../../index';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUserAlt  } from 'react-icons/fa';
import { LOGIN_ROUTE, ADMIN_ROUTE, BASKET_ROUTE, USER_ACCOUNT_ROUTE, SHOP_ROUTE, PRIVACY_ROUTE, TERMS_ROUTE, SELLER_ACCOUNT_ROUTE } from '../../utils/consts';
import './NavBar.css';
import { FaTelegram } from "react-icons/fa6";
import EMM from '../../icons/EMM2.png';
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { FaUserGroup } from "react-icons/fa6";

const NavBar = observer(() => {
    const { user, thing } = useContext(Context);
    
    const navigate = useNavigate();


    useEffect(() => {
        if (user.isAuth) {
            thing.loadBasket(); 
        }
    }, [user.isAuth, thing]);

    const logOut = () => {
        user.logout(); 
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
          }
        navigate(LOGIN_ROUTE); 
    };

    return (
        <Navbar bg="dark" variant="dark" expand={false} className="bg-body-tertiary" style={{ justifyContent: 'center' }}>
            <div className='navbar'>
                <Navbar.Brand onClick={() => navigate(SHOP_ROUTE)} style={{color: 'white'}}>
                    <img src={EMM} alt='EMM' />
                </Navbar.Brand>
                
                <div className='menu'>
                    {user.isAuth && (
                        <>
                        {user.user.role === 'SELLER' && (
                            <Button
                                className='seller-account'
                                variant="outline-light"
                                onClick={() => navigate(SELLER_ACCOUNT_ROUTE)}
                            >
                                <FaUserGroup />
                            </Button>
                        )}
                            <Button
                                className='shopping-cart'
                                variant="outline-light"
                                onClick={() => navigate(BASKET_ROUTE)}
                                style={{ position: 'relative' }}
                            >
                                <FaShoppingCart />
                                {thing.basket.length > 0 && (
                                    <span
                                        style={{
                                            position: 'absolute',
                                            top: '-8px',
                                            right: '-8px',
                                            backgroundColor: '#d70d0d',
                                            color: 'white',
                                            borderRadius: '50%',
                                            padding: '3px 6px',
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
                                <FaUserAlt />
                            </Button>
                        </>
                    )}
                    <Navbar.Toggle aria-controls="navbarScroll" data-bs-theme="dark"  style={{color: 'white'}}/>
                </div>
                
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '165px', color: 'white' }}
                        navbarScroll
                    >
                        <Nav.Link href='https://t.me/express_model_marketplace' style={{ display: 'flex', gap: '5px', alignItems: 'center', color: 'white' }}>
                            <FaTelegram /> Us in Telegram
                        </Nav.Link>
                        <Nav.Link onClick={() => navigate(SHOP_ROUTE)} style={{ display: 'flex', gap: '5px', alignItems: 'center', color: 'white' }}>
                            <FaCartShopping /> Store
                        </Nav.Link>
                        <Nav.Link onClick={() => navigate(PRIVACY_ROUTE)} style={{ display: 'flex', gap: '5px', alignItems: 'center', color: 'white' }}>
                            <FaUserGroup /> Referral program
                        </Nav.Link>
                        <Nav.Link onClick={() => navigate(TERMS_ROUTE)} style={{ display: 'flex', gap: '5px', alignItems: 'center', color: 'white' }}>
                            <IoShieldCheckmarkSharp /> Terms of warranty
                        </Nav.Link>
                    </Nav>
                    <div className="d-flex" style={{ justifyContent: 'flex-end' }}>
                        {user.isAuth ? (
                            <>
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
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Button variant="outline-danger" onClick={() => navigate(LOGIN_ROUTE)}>
                                Authorization
                            </Button>
                        )}
                    </div>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
});

export default NavBar;
