import React, { useState, useEffect, useContext } from "react";
import { message, QRCode, Select } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { Context } from '../../index';
import { createOrder } from '../../http/orderAPI';
import { createExchangeRequest } from '../../http/exchangeAPI';
import { USER_ACCOUNT_ROUTE } from "../../utils/consts";
import styles from './PaymentPage.module.css';
import BackButton from "../../components/UI/BackButton/BackButton";
import CopyableButton from "../../components/UI/CopyableButton/CopyableButton";
import useCryptoRates from '../../hooks/useCryptoRates'; // Импортируем хук
import { wallets } from '../../utils/cryptoWallets'; // Импортируем wallets
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

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

  const { cryptoRates, fetchCryptoRates } = useCryptoRates();

  const [selectedCrypto, setSelectedCrypto] = useState('usdt'); 
  const [cryptoTransactionHash, setCryptoTransactionHash] = useState(''); 
  const [isHashValid, setIsHashValid] = useState(false); 
  const [isConfirming, setIsConfirming] = useState(false); // Добавлено состояние для анимации загрузки

  const convertAmountForCrypto = (crypto) => {
    const rate = cryptoRates[crypto];
    if (!rate) return "Loading...";
    return (totalAmountUSD / rate).toFixed(6);
  };

  // Проверка валидности хэша транзакции (допустим, минимум 10 символов)
  const handleTransactionHashChange = (e) => {
    const hash = e.target.value;
    setCryptoTransactionHash(hash);
    setIsHashValid(hash.length >= 10); // Проверяем минимальную длину хэша
  };

  const handleConfirmPayment = async () => {
    setIsConfirming(true); // Устанавливаем состояние загрузки в true
    try {
      const cryptoPaymentAmount = parseFloat(convertAmountForCrypto(wallets[selectedCrypto].currency));

      if (isExchangePayment) {
        const { thingId, selectedThingId, userComment } = exchangeData;
        await createExchangeRequest({
          oldThingId: thingId,
          newThingId: selectedThingId,
          userComment,
          cryptoCurrency: wallets[selectedCrypto].currency,
          cryptoTransactionHash,
          cryptoPaymentAmount,
        });
        message.success('Awaiting confirmation!');
        navigate(USER_ACCOUNT_ROUTE);
      } else {
        await createOrder({
          cryptoCurrency: wallets[selectedCrypto].currency,
          cryptoTransactionHash,
          cryptoPaymentAmount,
        });
        await thing.clearBasket();
        message.success('Awaiting confirmation!');
        navigate(USER_ACCOUNT_ROUTE);
      }
    } catch (error) {
      message.error('Error in payment processing');
      console.error('Error in payment processing:', error);
    } finally {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
      }
      setIsConfirming(false); // Устанавливаем состояние загрузки в false после завершения
    }
  };

  return (
    <div className={styles.payment_page}>
      <div className={styles.payment_details}>
        <div className={styles.topic_back}>
          <BackButton />
          <h4>Итого: {totalAmountUSD} USD</h4>
        </div>

        <div className={styles.selector_pay}>
          <div className={styles.choose_top}>
            <label htmlFor="cryptoSelect">Choose cryptocurrency for payment:</label>
          </div>
          <Select
            id="cryptoSelect"
            value={selectedCrypto}
            onChange={(value) => setSelectedCrypto(value)}
            placeholder="Choose"
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
            <span>Wallet address {wallets[selectedCrypto].currency}: </span>
            <CopyableButton 
              value={wallets[selectedCrypto].address}
              className={styles.copyable_address}
              title="Click to copy"
            />
          </div>
        </div>

        <div className={styles.transaction_hash}>
          <label htmlFor="transactionHash">
          After the transfer, insert the hash of the transaction and click on confirm
          </label>
          <input
            type="text"
            id="transactionHash"
            value={cryptoTransactionHash}
            onChange={handleTransactionHashChange}
            placeholder="Enter the transaction hash"
          />
          <button 
            className={styles.confirm_btn} 
            onClick={handleConfirmPayment} 
            disabled={!isHashValid || isConfirming} // Блокируем кнопку при загрузке
          >
            {isConfirming ? <Spin indicator={<LoadingOutlined style={{color: 'white'}} spin />}/> : 'Confirm payment'} 
          </button>
        </div>

        <p style={{ color: "gray", fontSize: "0.9em" }}>
        Cryptocurrency exchange rate is updated every 15 minutes. Please make sure to pay at the current exchange rate.
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
