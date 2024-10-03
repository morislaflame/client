import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import './PaymentPage.css';
import { message, QRCode } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Context } from '../../index';
import { createOrder } from '../../http/orderAPI';
import { createExchangeRequest } from '../../http/exchangeAPI'; // Импортируем функцию для создания запроса на обмен
import { USER_ACCOUNT_ROUTE } from "../../utils/consts";
import { Typography } from 'antd';

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
  const [cryptoTransactionHash, setCryptoTransactionHash] = useState(''); // Хэш транзакции
  const [isHashValid, setIsHashValid] = useState(false); // Проверка валидности хэша

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
    fetchCryptoRates();

    // Устанавливаем интервал для обновления данных каждые 2 минуты
    const interval = setInterval(() => {
      fetchCryptoRates();
    }, 120000); // 120000 миллисекунд = 2 минуты

    return () => clearInterval(interval); // Очищаем интервал при размонтировании компонента
  }, []);

  // Конвертация суммы в зависимости от выбранной криптовалюты
  const convertAmountForCrypto = (crypto) => {
    const rate = cryptoRates[crypto];
    if (!rate) return "Загрузка...";
    return (totalAmountUSD / rate).toFixed(6); // Считаем сумму в криптовалюте
  };

  // Проверка валидности хэша транзакции (допустим, минимум 10 символов)
  const handleTransactionHashChange = (e) => {
    const hash = e.target.value;
    setCryptoTransactionHash(hash);
    setIsHashValid(hash.length >= 10); // Проверяем минимальную длину хэша
  };

  const handleConfirmPayment = async () => {
    try {
      const cryptoPaymentAmount = convertAmountForCrypto(wallets[selectedCrypto].currency);

      if (isExchangePayment) {
        // Это доплата при обмене
        const { thingId, selectedThingId, userComment } = exchangeData;
        await createExchangeRequest(thingId, selectedThingId, userComment);
        navigate(USER_ACCOUNT_ROUTE);
      } else {
        // Обычная оплата заказа
        await createOrder({
          cryptoCurrency: wallets[selectedCrypto].currency,
          cryptoTransactionHash,
          cryptoPaymentAmount,
        });
        await thing.clearBasket();
        navigate(USER_ACCOUNT_ROUTE);
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
            <QRCode
              value={`${wallets[selectedCrypto].address}?amount=${convertAmountForCrypto(wallets[selectedCrypto].currency)}`}
              size={256}
              style={{ margin: '0 auto' }} 
              // color={'white'}
            />

            </div>
          </div>

          <p>
            Wallet address {wallets[selectedCrypto].currency}:{" "}
            <span
              onClick={() => {
                navigator.clipboard.writeText(wallets[selectedCrypto].address)
                  .then(() => {
                    message.success("Codied!");
                  })
                  .catch((err) => {
                    console.error("Error when copying an address:", err);
                    message.error("Error");
                  });
              }}
              className="copyableAddress"
              title="Click to copy the address"
            >
              {wallets[selectedCrypto].address}
            </span>
          </p>


        </div>

        {/* Поле для ввода хэша транзакции */}
        <div className="transaction-hash">
          <label htmlFor="transactionHash">Введите хэш транзакции:</label>
          <input
            type="text"
            id="transactionHash"
            value={cryptoTransactionHash}
            onChange={handleTransactionHashChange}
            placeholder="Введите хэш транзакции"
          />
        </div>

        {/* Кнопка подтверждения оплаты */}
        <button 
          className="btn btn-primary" 
          onClick={handleConfirmPayment} 
          disabled={!isHashValid} // Деактивируем кнопку, если хэш не валидный
        >
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
