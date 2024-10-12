import React, { useState, useEffect, useContext } from "react";
import { message, QRCode, Select } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { Context } from '../../index';
import { createOrder } from '../../http/orderAPI';
import { createExchangeRequest } from '../../http/exchangeAPI';
import { USER_ACCOUNT_ROUTE } from "../../utils/consts";
import styles from './PaymentPage.module.css';
import { SiTether, SiBitcoinsv, SiEthereum, SiLitecoin } from "react-icons/si";
import BackButton from "../../components/BackButton/BackButton";
import CopyableButton from "../../components/CopyableButton/CopyableButton";
import useCryptoRates from '../../hooks/useCryptoRates'; // Импортируем хук

const PaymentPage = () => {
  const { thing, exchange } = useContext(Context);
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

  // Объект wallets
  const wallets = {
    usdt: {
      address: "0x5541a5FD4Cc660F356601DBeCdD2be3e19548095",
      currency: "USDT",
      icon: <SiTether />,
    },
    bitcoin: {
      address: "bc1q0jh3phrlml2y3uszj38w33jmrhefydk36ekvv0",
      currency: "BTC",
      icon: <SiBitcoinsv />,
    },
    ethereum: {
      address: "0x5541a5FD4Cc660F356601DBeCdD2be3e19548095",
      currency: "ETH",
      icon: <SiEthereum />,
    },
    litecoin: {
      address: "ltc1qe6jl3ah8ar586rzjv7lj4aypssx4j6wlscxj2s",
      currency: "LTC",
      icon: <SiLitecoin />,
    },
  };

  // Используем хук для получения курсов криптовалют
  const { cryptoRates, fetchCryptoRates } = useCryptoRates();

  const [selectedCrypto, setSelectedCrypto] = useState('usdt'); 
  const [cryptoTransactionHash, setCryptoTransactionHash] = useState(''); 
  const [isHashValid, setIsHashValid] = useState(false); // Проверка валидности хэша

  // Получение курсов криптовалют при монтировании и обновление каждые 15 минут
  useEffect(() => {
    fetchCryptoRates();
    const interval = setInterval(() => {
      fetchCryptoRates();
    }, 900000); // 15 минут

    return () => clearInterval(interval); 
  }, [fetchCryptoRates]);

  // Функция для конвертации суммы в выбранную криптовалюту
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
        message.success('Ожидайте подтверждения!');
        navigate(USER_ACCOUNT_ROUTE);
      } else {
        // Обычная оплата заказа
        await createOrder({
          cryptoCurrency: wallets[selectedCrypto].currency,
          cryptoTransactionHash,
          cryptoPaymentAmount,
        });
        await thing.clearBasket();
        message.success('Ожидайте подтверждения!');
        navigate(USER_ACCOUNT_ROUTE);
      }
    } catch (error) {
      message.error('Ошибка при обработке платежа');
      console.error('Ошибка при обработке платежа:', error);
    }
  };

  return (
    <div className={styles.payment_page}>
      <div className={styles.payment_details}>
        <div className={styles.topic_back}>
          <BackButton />
          <h4>Итого: {totalAmountUSD} USD</h4>
        </div>

        {/* Селектор для выбора криптовалюты */}
        <div className={styles.selector_pay}>
          <div className={styles.choose_top}>
            <label htmlFor="cryptoSelect">Выберите криптовалюту для оплаты:</label>
          </div>
          <Select
            id="cryptoSelect"
            value={selectedCrypto}
            onChange={(value) => setSelectedCrypto(value)}
            placeholder="Выберите"
            suffixIcon={<span />}
            options={Object.keys(wallets).map((key) => ({
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
            {convertAmountForCrypto(wallets[selectedCrypto].currency)} {wallets[selectedCrypto].currency}
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
            <span>Адрес кошелька {wallets[selectedCrypto].currency}: </span>
            <CopyableButton 
              value={wallets[selectedCrypto].address}
              className={styles.copyable_address}
              title="Нажмите для копирования"
            />
          </div>
        </div>

        {/* Поле для ввода хэша транзакции */}
        <div className={styles.transaction_hash}>
          <label htmlFor="transactionHash">
            После перевода, вставьте хэш транзакции и нажмите на подтверждение
          </label>
          <input
            type="text"
            id="transactionHash"
            value={cryptoTransactionHash}
            onChange={handleTransactionHashChange}
            placeholder="Введите хэш транзакции"
          />
          {/* Кнопка подтверждения оплаты */}
          <button 
            className={styles.confirm_btn} 
            onClick={handleConfirmPayment} 
            disabled={!isHashValid} // Деактивируем кнопку, если хэш не валидный
          >
            Подтвердить оплату
          </button>
        </div>

        <p style={{ color: "gray", fontSize: "0.9em" }}>
          Курс обмена криптовалют обновляется каждые 15 минут. Пожалуйста, убедитесь, что оплата производится по актуальному курсу.
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;