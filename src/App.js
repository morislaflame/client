import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar/NavBar';
import { observer } from 'mobx-react-lite';
import { Context } from './index';
import { check } from './http/userAPI';
import Spinner from 'react-bootstrap/Spinner'
import Chat from './components/ChatForm/ChatForm';
import { postEvent, retrieveLaunchParams } from '@telegram-apps/sdk-react';

const App = observer(() => {
  const {user} = useContext(Context)
  const [loading, setLoading] = useState(true)
  // const {initDataRaw} = retrieveLaunchParams()


  // useEffect(() =>{
  //   postEvent('', { color: '#ffffff' });
  // }, [])

  useEffect(() => {
      check().then(data => {
        user.setUser(data)
        user.setIsAuth(true)
      }).finally(() => setLoading(false))
  }, [])

  if(loading) {
    return <Spinner animation={"grow"}/>
  }

  return (
    <BrowserRouter>
        <NavBar />
        <AppRouter />
        <Chat/>
    </BrowserRouter>
  );
});

export default App;
