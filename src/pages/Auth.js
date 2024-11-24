import React, { useContext, useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from '../utils/consts';
import { registration, login } from '../http/userAPI';
import { observer } from 'mobx-react-lite';
import { Context } from "../index";
import styles from './Auth.module.css';
import MyButton from '../components/UI/MyButton/MyButton';
import { message } from 'antd'; // Импортируем компонент message из antd

const Auth = observer(() => {
  const { user, thing } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === LOGIN_ROUTE;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const click = async () => {
    try {
      let data;
      if (isLogin) {
        data = await login(email, password);
      } else {
        data = await registration(email, password);
      }
      user.setUser(data);
      user.setIsAuth(true);
      await thing.loadBasket();

      // Сохраняем маршрут магазина в localStorage перед перезагрузкой
      localStorage.setItem('redirectAfterReload', SHOP_ROUTE);
      window.location.reload(); // Перезагружаем страницу
    } catch (e) {
      // Используем antd message для отображения ошибок
      message.error(e.response.data.message);
    }
  };

  // После перезагрузки проверяем, есть ли сохранённый маршрут и перенаправляем
  useEffect(() => {
    const redirectAfterReload = localStorage.getItem('redirectAfterReload');
    if (redirectAfterReload) {
      localStorage.removeItem('redirectAfterReload'); // Очищаем сохранённый маршрут
      navigate(redirectAfterReload); // Перенаправляем на страницу магазина
    }
  }, [navigate]);

  return (
    <div className={styles.auth}>
        <div className={styles.auth_form}>
          <h2 className={styles.auth_title}>{isLogin ? 'Authorization' : 'Registration'}</h2>
          <div className={styles.auth_form_row}>
            <Form.Control
              className='mt-2'
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Form.Control
              className='mt-2'
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              type='password'
            />
          </div>
            <div className={styles.auth_row}>
              {isLogin ? (
                <div className={styles.auth_row_link}>
                  No account? <NavLink to={REGISTRATION_ROUTE}>Sign up</NavLink>
                </div>
              ) : (
                <div className={styles.auth_row_link}>
                  Have an account? <NavLink to={LOGIN_ROUTE}>Sign in</NavLink>
                </div>
              )}
              <div className={styles.auth_row_button}>
                <MyButton 
                  text={isLogin ? 'Sign in' : 'Sign up'}
                  onClick={click}
                />  
              </div>
            </div>
        </div>
    </div>
  );
});

export default Auth;
