import React, { useContext, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import FormText from 'react-bootstrap/esm/FormText';
import Card from 'react-bootstrap/esm/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from '../utils/consts';
import { registration, login } from '../http/userAPI';
import Row from 'react-bootstrap/esm/Row';
import { observer } from 'mobx-react-lite';
import { Context } from "../index";

const Auth = observer(() => {
  const {user} = useContext(Context)
  const location = useLocation()
  const navigate = useNavigate()
  const isLogin = location.pathname === LOGIN_ROUTE
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const click = async () => {
    try {
      let data;
      if (isLogin) {
        data = await login(email, password);
      } else {
        data = await registration(email, password);
      }
      user.setUser(user)
      user.setIsAuth(true)
      navigate(SHOP_ROUTE)
    } catch (e) {
      alert(e.response.data.message)
    }
  }

  return (
    <div>
        <Container 
            className='d-flex justify-content-center align-items-center'
            style={{height: window.innerHeight -54}}
        >
          <Card style={{width: 600}} className='p-5'>
            <h2 className='m-auto'>{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
            <Form className='d-flex flex-column'>
              <Form.Control
                className='mt-4'
                placeholder="Введите email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Form.Control
                className='mt-2'
                placeholder="Введите пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
                type='password'
              />
            
              <Row className='d-flex justify-content-between mt-3 pl-3 pr-3'>
                {isLogin ? 
                <div className='align-self-center mt-3'>
                Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Регистрация</NavLink>
                </div>
                :
                <div className='align-self-center mt-3'>
                  Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войти</NavLink>
                </div>
                }
                <Button 
                  className='mt-3' 
                  variant='outline-danger'
                  onClick={click}
                >
                  {isLogin ? 'Войти' : 'Регистрация'}
                </Button>
              </Row>
            </Form>
          </Card>
        </Container>
    </div>
  );
});

export default Auth;