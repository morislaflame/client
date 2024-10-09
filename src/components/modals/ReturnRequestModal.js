import React, { useState, useCallback } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import { Input, Select, message } from 'antd';
import { PiKeyReturnFill } from 'react-icons/pi';
import styles from './ReturnRequestModal.module.css';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../../index';
import { SiTether, SiBitcoinsv, SiEthereum, SiLitecoin } from 'react-icons/si';
import { CustomOffcanvas, ExchangeOffcanvasHeader, CustomOffcanvasBody, CustomOffcanvasHeader } from '../StyledComponents';

const ReturnRequestModal = observer(({ show, handleClose, selectedThing }) => {
  const { return: returnStore } = useContext(Context);
  const [reason, setReason] = useState('');
  const [cryptoCurrency, setCryptoCurrency] = useState('usdt');
  const [cryptoWalletAddress, setCryptoWalletAddress] = useState('');

  const wallets = {
    usdt: {
      currency: 'USDT',
      icon: <SiTether />,
    },
    bitcoin: {
      currency: 'BTC',
      icon: <SiBitcoinsv />,
    },
    ethereum: {
      currency: 'ETH',
      icon: <SiEthereum />,
    },
    litecoin: {
      currency: 'LTC',
      icon: <SiLitecoin />,
    },
  };

  const handleSubmitReturn = useCallback(async () => {
    const refundAmount = selectedThing.price;
    try {
      await returnStore.createNewReturn({
        thingId: selectedThing.id,
        reason: reason || '',
        cryptoCurrency: wallets[cryptoCurrency].currency,
        cryptoWalletAddress,
        refundAmount,
      });
      message.success('Ожидайте подтверждения возврата');
      setTimeout(() => {
        handleClose();
        returnStore.loadUserReturns();
      }, 3000);
    } catch (e) {
      console.error('Ошибка при создании возврата:', e);
      message.error('Ошибка при создании возврата');
    }
  }, [cryptoCurrency, cryptoWalletAddress, handleClose, reason, selectedThing, returnStore]);

  return (
    <CustomOffcanvas show={show} onHide={handleClose} placement="bottom">
      <CustomOffcanvasHeader closeButton>
        <Offcanvas.Title className={styles.offcanv_header}>Запрос на возврат</Offcanvas.Title>
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
                placeholder="Причина"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{ width: '100%', minHeight: '100px', marginBottom: '10px' }}
              />
              <div className={styles.selector_pay}>
                <label htmlFor="cryptoSelect">Выберите криптовалюту для возврата:</label>
                <Select
                  id="cryptoSelect"
                  value={cryptoCurrency}
                  onChange={(value) => setCryptoCurrency(value)}
                  placeholder="Выбрать"
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
              <div className={styles.wallet_input}>
                <label htmlFor="walletAddress">Введите адрес вашего кошелька:</label>
                <Input
                  id="walletAddress"
                  value={cryptoWalletAddress}
                  onChange={(e) => setCryptoWalletAddress(e.target.value)}
                  placeholder="Адрес кошелька"
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
            >
              <span>Сделать возврат</span>
              <PiKeyReturnFill />
            </Button>
          </>
        )}
      </CustomOffcanvasBody>
    </CustomOffcanvas>
  );
});

export default ReturnRequestModal;
