import React, { useContext, useEffect } from 'react';
import { Context } from '../../index';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { LOGIN_ROUTE, ADMIN_ROUTE, BASKET_ROUTE } from '../../utils/consts';
import './NavBar.css';
import { FaTelegram } from "react-icons/fa6";

const NavBar = observer(() => {
    const { user, thing } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        thing.loadBasket(); // Загружаем корзину при первой загрузке
    }, [thing]);

    const logOut = () => {
        user.setUser({});
        user.setIsAuth(false);
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary" style={{justifyContent: 'center'}}>
            {user.isAuth ? (
                <div className='navbar'>
                    <Navbar.Brand href="/">Model's Hotel</Navbar.Brand>
                    
                    <div className='menu'>
                    <Button
                        className='shopping-card'
                                variant="outline-dark"
                                onClick={() => navigate(BASKET_ROUTE)}
                            >
                                <FaShoppingCart size={24} />
                                {thing.basket.length > 0 && (
                                    <span
                                        style={{
                                            position: 'absolute',
                                            top: '1px',
                                            backgroundColor: 'red',
                                            color: 'white',
                                            borderRadius: '50%',
                                            padding: '1px 6px',
                                            fontSize: '12px',
                                        }}
                                    >
                                        {thing.basket.length}
                                    </span>
                                )}
                            </Button>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    </div>
                    
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '120px' }}
                            navbarScroll
                        >
                            <Nav.Link href='https://t.me/themodelshotel' style={{display: 'flex', gap: '5px', alignItems: 'center', color:'black'}}><FaTelegram />Us in Telegram</Nav.Link>
                            <Nav.Link href="/shop">Store</Nav.Link>
                            <Nav.Link href='/login'>Login</Nav.Link>
                            
                        </Nav>
                        <Form className="d-flex" style={{justifyContent: 'flex-end'}}>
                            
                            <Button 
                                variant="outline-danger" 
                                onClick={logOut}>
                                Выйти
                            </Button>
                            <Button 
                                variant="outline-danger" 
                                style={{ marginLeft: '12px' }} 
                                onClick={() => navigate(ADMIN_ROUTE)}>
                                Админка
                            </Button>
                            
                        </Form>
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
