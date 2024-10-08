// components/ReturnRequestOffcanvas.js
import React, { useCallback } from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import { CustomOffcanvasHeader, CustomOffcanvasBody } from './StyledComponents';
import { PiKeyReturnFill } from 'react-icons/pi';
import { Select, Input, message } from 'antd';
import styles from './UI.module.css';
import { SiTether, SiBitcoinsv, SiEthereum, SiLitecoin } from 'react-icons/si';

const ReturnRequestOffcanvas = ({
  show,
  handleClose,
  selectedThing,
  wallets,
  cryptoCurrency,
  setCryptoCurrency,
  cryptoWalletAddress,
  setCryptoWalletAddress,
  reason,
  setReason,
  handleSubmitReturn,
}) => {
  return (
    <Offcanvas show={show} onHide={handleClose} placement="bottom">
      <CustomOffcanvasHeader>
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
    </Offcanvas>
  );
};

export default ReturnRequestOffcanvas;
