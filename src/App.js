import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar/NavBar';
import { observer } from 'mobx-react-lite';
import { Context } from './index';
import { check, telegramAuth } from './http/userAPI';
import Spinner from 'react-bootstrap/Spinner';
import Chat from './components/ChatForm/ChatForm';
import { postEvent, retrieveLaunchParams } from '@telegram-apps/sdk-react';
import Footer from './components/Footer/Footer';
import LoadingIndicator from './components/LoadingIndicator/LoadingIndicator';

const App = observer(() => {
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      const initData = window.Telegram?.WebApp?.initData;
      console.log('Init Data:', initData); // Для отладки

      if (initData) {
        try {
          // Выполняем аутентификацию через Telegram
          const telegramResponse = await telegramAuth(initData);
          console.log('Telegram Response:', telegramResponse); // Для отладки

          if (telegramResponse) {
            user.setUser(telegramResponse);
            user.setIsAuth(true);
          }
        } catch (error) {
          console.error('Telegram authentication error:', error);
        }
      }

      try {
        // Выполняем проверку состояния аутентификации
        const data = await check();
        console.log('Check Data:', data); // Для отладки

        if (data) {
          user.setUser(data);
          user.setIsAuth(true);
        }
      } catch (error) {
        console.error('Check authentication error:', error);
      }

      setLoading(false);
    };

    authenticate();
  }, [user]);

  if (loading) {
    return (
      <div className='loading'>
        <Spinner animation="grow" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
      {/* <Footer/> */}
      {/* <Chat/> */}
    </BrowserRouter>
  );
});

export default App;
