import React, { useContext } from 'react';
import { Context } from '../index';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { ADMIN_ROUTE, LOGIN_ROUTE } from '../utils/consts';

import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

const NavBar = observer(() => {
    const {user} = useContext(Context)
    const navigate = useNavigate()

    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
    }

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
        {user.isAuth ?
        <Container fluid>
            <Navbar.Brand href="/">Model's Hotel</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
            <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: '100px' }}
                navbarScroll
            >
                <Nav.Link href="/shop">Store</Nav.Link>
                <Nav.Link href="/basket">Basket</Nav.Link>
                <Nav.Link href='/login'>Login</Nav.Link>
                
            </Nav>
            <Form className="d-flex">
                <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                />
                <Button 
                    variant="outline-danger" 
                    onClick={() => logOut()}>
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
        </Container>
        :
        <Button variant="outline-danger" onClick={() => navigate(LOGIN_ROUTE)}>Авторизация</Button>
        }       
        </Navbar>
    );
});

export default NavBar;