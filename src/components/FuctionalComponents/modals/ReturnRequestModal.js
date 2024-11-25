import React, { useState, useCallback, useEffect } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import { Input, Select, message, Spin } from 'antd';
import { PiKeyReturnFill } from 'react-icons/pi';
import styles from './ReturnRequestModal.module.css';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../../../index';
import { CustomOffcanvas, CustomOffcanvasBody, CustomOffcanvasHeader } from '../../NonUsedComponents/StyledComponents';
import useCryptoRates from '../../../hooks/useCryptoRates';
import { wallets } from '../../../utils/cryptoWallets'; 
import { LoadingOutlined } from '@ant-design/icons';

const ReturnRequestModal = observer(({ show, handleClose, selectedThing }) => {
  const { return: returnStore } = useContext(Context);
  const [reason, setReason] = useState('');
  const [cryptoCurrency, setCryptoCurrency] = useState('usdt');
  const [cryptoWalletAddress, setCryptoWalletAddress] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Добавлено состояние для анимации загрузки

  const { cryptoRates, fetchCryptoRates } = useCryptoRates();

  // Функция для конвертации USD в выбранную криптовалюту
  const convertUsdToCrypto = useCallback((usdAmount, crypto) => {
    const rate = cryptoRates[wallets[crypto].currency];
    if (!rate) return null;
    return (usdAmount / rate).toFixed(6);
  }, [cryptoRates, wallets]);

  // Обновляем сумму в криптовалюте при изменении цены или выбранной валюты
  useEffect(() => {
    if (selectedThing && selectedThing.price && cryptoCurrency) {
      const convertedAmount = convertUsdToCrypto(selectedThing.price, cryptoCurrency);
      setCryptoAmount(convertedAmount);
    }
  }, [selectedThing, cryptoCurrency, convertUsdToCrypto]);

  const handleSubmitReturn = useCallback(async () => {
    if (!cryptoAmount) {
      message.warning('The amount in the selected cryptocurrency is not calculated');
      return;
    }
    setIsSubmitting(true); // Устанавливаем состояние загрузки в true
    try {
      await returnStore.createNewReturn({
        thingId: selectedThing.id,
        reason: reason || '',
        cryptoCurrency: wallets[cryptoCurrency].currency,
        cryptoWalletAddress,
        refundAmount: cryptoAmount,
      });
      message.success('Wait for return confirmation!');
      setTimeout(() => {
        handleClose();
        returnStore.loadUserReturns();
      }, 3000);
    } catch (e) {
      console.error('Error creating return:', e);
      message.error('Error creating return');
    } finally {
      setIsSubmitting(false); // Устанавливаем состояние загрузки в false после завершения
    }
  }, [cryptoAmount, cryptoCurrency, cryptoWalletAddress, handleClose, reason, selectedThing, returnStore, wallets]);

  return (
    <CustomOffcanvas show={show} onHide={handleClose} placement="bottom">
      <CustomOffcanvasHeader>
        <Offcanvas.Title className={styles.offcanv_header}>Refund Request</Offcanvas.Title>
      </CustomOffcanvasHeader>
      <CustomOffcanvasBody>
        {selectedThing && (
          <>
            <div className={styles.selection}>
              <div className={styles.selection_name}>
                <span>{selectedThing.name}</span>
                <span>${selectedThing.price}</span>
              </div>
              <textarea
                placeholder="Reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{ width: '100%', minHeight: '80px' }}
              />
              <div className={styles.selector_pay}>
                <label htmlFor="cryptoSelect">Select cryptocurrency:</label>
                <Select
                  id="cryptoSelect"
                  value={cryptoCurrency}
                  onChange={(value) => setCryptoCurrency(value)}
                  placeholder="Select"
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
              {cryptoAmount && (
                <div className={styles.crypto_amount}>
                  <span>Amount in {wallets[cryptoCurrency].currency}: </span><b>{cryptoAmount}</b>
                </div>
              )}
              <div className={styles.wallet_input}>
                <label htmlFor="walletAddress">Wallet</label>
                <Input
                  id="walletAddress"
                  value={cryptoWalletAddress}
                  onChange={(e) => setCryptoWalletAddress(e.target.value)}
                  placeholder="Wallet address"
                />
              </div>
              
            </div>

            <Button
              onClick={handleSubmitReturn}
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '7px',
              }}
              className={styles.button}
              disabled={isSubmitting} // Блокируем кнопку при загрузке
            >
              {isSubmitting ? <Spin indicator={<LoadingOutlined style={{color: 'white'}} spin />}/> : 'Request Refund'} 
              <PiKeyReturnFill />
            </Button>
          </>
        )}
      </CustomOffcanvasBody>
    </CustomOffcanvas>
  );
});

export default ReturnRequestModal;
