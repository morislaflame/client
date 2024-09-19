import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import UserStore from './store/UserStore';
import ThingStore from './store/ThingsStore';
import { SDKProvider } from '@telegram-apps/sdk-react';


export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SDKProvider>
  <Context.Provider value={{
    user: new UserStore(),
    thing: new ThingStore(),
  }}>
    <App />
  </Context.Provider>
  </SDKProvider>
  ,
);

reportWebVitals();
