// src/components/PaymentPage/PaymentPage.js

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import './PaymentPage.css';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate, useLocation } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Context } from '../../index';
import { createOrder } from '../../http/orderAPI';
import { createExchangeRequest } from '../../http/exchangeAPI'; // Импортируем функцию для создания запроса на обмен
import { USER_ACCOUNT_ROUTE } from "../../utils/consts";

const PaymentPage = () => {
  const { thing } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  // Проверяем, пришел ли пользователь для доплаты при обмене
  const isExchangePayment = location.state?.exchange || false;

  // Если это доплата при обмене, получаем необходимые данные
  const exchangeData = isExchangePayment ? location.state : null;

  // Получаем общую сумму заказа
  const totalAmountUSD = isExchangePayment
    ? exchangeData.priceDifference
    : thing.totalPrice || 0;

  // Адреса кошельков для разных криптовалют (оставляем без изменений)
  const wallets = {
    usdt: {
      address: "0x5541a5FD4Cc660F356601DBeCdD2be3e19548095",
      currency: "USDT",
    },
    bitcoin: {
      address: "bc1q0jh3phrlml2y3uszj38w33jmrhefydk36ekvv0",
      currency: "BTC",
    },
    ethereum: {
      address: "0x5541a5FD4Cc660F356601DBeCdD2be3e19548095",
      currency: "ETH",
    },
    litecoin: {
      address: "ltc1qe6jl3ah8ar586rzjv7lj4aypssx4j6wlscxj2s",
      currency: "LTC",
    },
  };

  const [cryptoRates, setCryptoRates] = useState({
    BTC: null,
    ETH: null,
    LTC: null,
    USDT: 1, // USDT обычно равен 1 USD
  });

  const [selectedCrypto, setSelectedCrypto] = useState('usdt'); // Криптовалюта по умолчанию

  // Функция для получения курса криптовалют с CoinGecko API (оставляем без изменений)
  const fetchCryptoRates = async () => {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin,tether&vs_currencies=usd"
      );
      setCryptoRates({
        BTC: response.data.bitcoin.usd,
        ETH: response.data.ethereum.usd,
        LTC: response.data.litecoin.usd,
        USDT: response.data.tether.usd,
      });
    } catch (error) {
      console.error("Ошибка получения курсов криптовалют:", error);
    }
  };

  useEffect(() => {
    fetchCryptoRates();

    // Устанавливаем интервал для обновления данных каждые 2 минуты
    const interval = setInterval(() => {
      fetchCryptoRates();
    }, 120000); // 120000 миллисекунд = 2 минуты

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(interval);
  }, []);

  // Конвертация суммы в зависимости от выбранной криптовалюты (оставляем без изменений)
  const convertAmountForCrypto = (crypto) => {
    const rate = cryptoRates[crypto];
    if (!rate) return "Загрузка..."; // Если курс еще не загрузился
    return (totalAmountUSD / rate).toFixed(6); // Считаем сумму в криптовалюте
  };

  const handleConfirmPayment = async () => {
    try {
      if (isExchangePayment) {
        // Это доплата при обмене
        const { thingId, selectedThingId, userComment } = exchangeData;
        await createExchangeRequest(thingId, selectedThingId, userComment);
        navigate(USER_ACCOUNT_ROUTE); // Перенаправляем на страницу аккаунта
      } else {
        // Обычная оплата заказа
        await createOrder();
        await thing.clearBasket();
        navigate(USER_ACCOUNT_ROUTE); // Перенаправляем на страницу аккаунта
      }
    } catch (error) {
      console.error('Ошибка при обработке оплаты:', error);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-details">
        <h3>Сумма к оплате: {totalAmountUSD} USD</h3>

        {/* Селектор для выбора криптовалюты */}
        <div className="selector-pay">
          <label htmlFor="cryptoSelect">Выберите криптовалюту для оплаты:</label>
          <DropdownButton
            id="dropdown-cryptoSelect"
            title={` ${wallets[selectedCrypto].currency}`}
            onSelect={(key) => setSelectedCrypto(key)}
            variant="dark"
          >
            {Object.keys(wallets).map((key) => (
              <Dropdown.Item key={key} eventKey={key}>
                {wallets[key].currency}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>

        {/* Отображение QR-кода и суммы для выбранной криптовалюты */}
        <div className="crypto-payment">
          <h4>
            Сумма: {convertAmountForCrypto(wallets[selectedCrypto].currency)}{" "}
            {wallets[selectedCrypto].currency}
          </h4>
          <div className="qr-box">
            <div className="qr-code">
              <QRCodeCanvas
                value={`${wallets[selectedCrypto].address}?amount=${convertAmountForCrypto(
                  wallets[selectedCrypto].currency
                )}`}
                size={256}
              />
            </div>
          </div>

          <p>Адрес кошелька для {wallets[selectedCrypto].currency}: {wallets[selectedCrypto].address}</p>

        </div>
        <button className="btn btn-primary" onClick={handleConfirmPayment}>
          Подтвердить оплату
        </button>

        <p style={{ color: "gray", fontSize: "0.9em" }}>
          Курс криптовалют обновляется каждые 2 минуты. Пожалуйста, убедитесь, что оплата произведена с актуальным курсом.
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
