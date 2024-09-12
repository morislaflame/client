import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import './PaymentPage.css';
import { QRCodeCanvas } from 'qrcode.react'; // Импортируем QRCodeCanvas
import { useLocation, useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown'; // Импортируем Bootstrap Dropdown
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Context } from '../../index'; // Для работы с контекстом
import { createOrder } from '../../http/orderAPI';
import { USER_ACCOUNT_ROUTE } from "../../utils/consts";

const PaymentPage = () => {
    const { thing, user } = useContext(Context);
  const location = useLocation();
  const totalAmountUSD = location.state?.totalAmount || 0;
  const navigate = useNavigate();

  // Адреса кошельков для разных криптовалют
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

  // Функция для получения курса криптовалют с CoinGecko API
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
    fetchCryptoRates(); // Вызов функции для получения данных при загрузке страницы

    // Устанавливаем интервал для обновления данных каждые 2 минуты
    const interval = setInterval(() => {
      fetchCryptoRates();
    }, 120000); // 120000 миллисекунд = 2 минуты

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(interval);
  }, []);

  // Конвертация суммы в зависимости от выбранной криптовалюты
  const convertAmountForCrypto = (crypto) => {
    const rate = cryptoRates[crypto];
    if (!rate) return "Загрузка..."; // Если курс еще не загрузился
    return (totalAmountUSD / rate).toFixed(6); // Считаем сумму в криптовалюте
  };

  const handleConfirmPayment = async () => {
    try {
      await createOrder(thing.basket); // Передаем содержимое корзины для создания заказа
      thing.resetBasket(); // Очищаем корзину после успешного создания заказа
      navigate(USER_ACCOUNT_ROUTE); // Перенаправляем на страницу аккаунта
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-details">
        <h3>Сумма к оплате: {totalAmountUSD} USD</h3>

        {/* Селектор для выбора криптовалюты с использованием Bootstrap Dropdown */}
        <div className="selector-pay">
          <label htmlFor="cryptoSelect">Choose a cryptocurrency for payment:</label>
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
