import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import UserStore from './store/UserStore';
import ReviewStore from './store/ReviewStore';
import { SDKProvider } from '@telegram-apps/sdk-react';
import OrderStore from './store/OrderStore';
import ReturnStore from './store/ReturnStore';
import ExchangeStore from './store/NonUsedStores/ExchangeStore';
import SellerStore from './store/SellerStore';
import AdminStore from './store/AdminStore';
import ModelStore from './store/ModelStore';

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SDKProvider>
  <Context.Provider value={{
    user: new UserStore(),
    review: new ReviewStore(),
    order: new OrderStore(),
    return: new ReturnStore(),
    exchange: new ExchangeStore(),
    seller: new SellerStore(),
    admin: new AdminStore(),
    model: new ModelStore(),
  }}>
    <App />
  </Context.Provider>
  </SDKProvider>
  ,
);

reportWebVitals();
