import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { message, QRCode } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { Select } from 'antd';
import { Context } from '../../index';
import { createOrder } from '../../http/orderAPI';
import { createExchangeRequest } from '../../http/exchangeAPI';
import { USER_ACCOUNT_ROUTE } from "../../utils/consts";
import styles from './PaymentPage.module.css';
import { SiTether, SiBitcoinsv, SiEthereum, SiLitecoin } from "react-icons/si";
import BackButton from "../../components/BackButton/BackButton";
import CopyableButton from "../../components/CopyableButton/CopyableButton";

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

  const wallets = {
    usdt: {
      address: "0x5541a5FD4Cc660F356601DBeCdD2be3e19548095",
      currency: "USDT",
      icon: <SiTether/>,
    },
    bitcoin: {
      address: "bc1q0jh3phrlml2y3uszj38w33jmrhefydk36ekvv0",
      currency: "BTC",
      icon: <SiBitcoinsv/>,
    },
    ethereum: {
      address: "0x5541a5FD4Cc660F356601DBeCdD2be3e19548095",
      currency: "ETH",
      icon: <SiEthereum/>,
    },
    litecoin: {
      address: "ltc1qe6jl3ah8ar586rzjv7lj4aypssx4j6wlscxj2s",
      currency: "LTC",
      icon: <SiLitecoin/>,
    },
  };

  const [cryptoRates, setCryptoRates] = useState({
    BTC: null,
    ETH: null,
    LTC: null,
    USDT: 1, 
  });

  const [selectedCrypto, setSelectedCrypto] = useState('usdt'); 
  const [cryptoTransactionHash, setCryptoTransactionHash] = useState(''); 
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
    const interval = setInterval(() => {
      fetchCryptoRates();
    }, 900000); 

    return () => clearInterval(interval); 
  }, []);

  const convertAmountForCrypto = (crypto) => {
    const rate = cryptoRates[crypto];
    if (!rate) return "Loading...";
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
      const cryptoPaymentAmount = parseFloat(convertAmountForCrypto(wallets[selectedCrypto].currency));

      if (isExchangePayment) {
        // Это доплата при обмене
        const { thingId, selectedThingId, userComment } = exchangeData;
        await createExchangeRequest({
          oldThingId: thingId,
          newThingId: selectedThingId,
          userComment,
          cryptoCurrency: wallets[selectedCrypto].currency,
          cryptoTransactionHash,
          cryptoPaymentAmount,
        });
        message.success('Await confirmation!');
        navigate(USER_ACCOUNT_ROUTE);
      } else {
        // Обычная оплата заказа
        await createOrder({
          cryptoCurrency: wallets[selectedCrypto].currency,
          cryptoTransactionHash,
          cryptoPaymentAmount,
        });
        await thing.clearBasket();
        message.success('Await confirmation!');
        navigate(USER_ACCOUNT_ROUTE);
      }
    } catch (error) {
      message.error('Error during payment processing');
      console.error('Error during payment processing:', error);
    }
  };

  return (
    <div className={styles.payment_page}>
      <div className={styles.payment_details}>
      <div className={styles.topic_back}><BackButton/><h4>Total: {totalAmountUSD} USD</h4></div>

        {/* Селектор для выбора криптовалюты */}
        <div className={styles.selector_pay}>
          <div className={styles.choose_top}>
            <label htmlFor="cryptoSelect">Choose a cryptocurrency for payment:</label>
          </div>
          <Select
            id="cryptoSelect"
            value={selectedCrypto}
            onChange={(value) => setSelectedCrypto(value)}
            placeholder="Select"
            suffixIcon={<span/>}
            options={Object.keys(wallets).map((key) =>({
              label: (
                <div className={styles.crypto_selector}>
                  <span>{wallets[key].currency}</span>
                  <span>{wallets[key].icon}</span>
                </div>
              ),
              value: key,
            }))}
          />
        </div>

        {/* Отображение QR-кода и суммы для выбранной криптовалюты */}
        <div className={styles.crypto_payment}>
          <h5>
            {convertAmountForCrypto(wallets[selectedCrypto].currency)}{" "}
            {wallets[selectedCrypto].currency}
          </h5>
          <div className={styles.qr_box}>
            <div className={styles.qr_code}>
              <QRCode
                value={`${wallets[selectedCrypto].address}?amount=${convertAmountForCrypto(wallets[selectedCrypto].currency)}`}
                size={256}
                style={{ margin: '0 auto' }} 
              />
            </div>
          </div>

          <div className={styles.address}>
            <span>Wallet address {wallets[selectedCrypto].currency}:{" "}</span>
            <CopyableButton 
            value={wallets[selectedCrypto].address}
            className={styles.copyable_address}
            title="Click to copy"
            />
          </div>
        </div>

        {/* Поле для ввода хэша транзакции */}
        <div className={styles.transaction_hash}>
          <label htmlFor="transactionHash">After the transfer, insert the transaction hash and click on confirmation</label>
          <input
            type="text"
            id="transactionHash"
            value={cryptoTransactionHash}
            onChange={handleTransactionHashChange}
            placeholder="Enter transaction hash"
          />
          {/* Кнопка подтверждения оплаты */}
          <button 
            className={styles.confirm_btn} 
            onClick={handleConfirmPayment} 
            disabled={!isHashValid} // Деактивируем кнопку, если хэш не валидный
          >
            Confirm payment
          </button>
        </div>

        <p style={{ color: "gray", fontSize: "0.9em" }}>
          Cryptocurrency exchange rate is updated every 15 minutes. Please make sure that payment is made with the current exchange rate.
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
