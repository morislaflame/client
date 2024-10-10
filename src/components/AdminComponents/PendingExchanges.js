import React, { useEffect, useState, useContext } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { message, Input } from 'antd';
import { THING_ROUTE, ALL_EXCHANGES_ROUTE } from '../../utils/consts';
import styles from './AdminComponents.module.css';

const PendingExchanges = observer(() => {
  const { exchange } = useContext(Context);
  const [refundTransactionHashes, setRefundTransactionHashes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    exchange.loadPendingExchanges(); // Метод в ExchangeStore для загрузки ожидающих обменов
  }, [exchange]);

  const handleApproveExchange = async (exchangeId) => {
    try {
      await exchange.approveExchange(exchangeId);
      message.success('Обмен подтвержден');
    } catch (error) {
      message.error('Ошибка при подтверждении обмена');
      console.error('Ошибка при подтверждении обмена:', error);
    }
  };

  const handleRejectExchange = async (exchangeId) => {
    try {
      await exchange.rejectExchange(exchangeId);
      message.success('Обмен отклонен');
    } catch (error) {
      message.error('Ошибка при отклонении обмена');
      console.error('Ошибка при отклонении обмена:', error);
    }
  };

  const handleConfirmPaymentExchange = async (exchangeId) => {
    try {
      await exchange.confirmPayment(exchangeId);
      message.success('Доплата подтверждена');
    } catch (error) {
      message.error('Ошибка при подтверждении доплаты');
      console.error('Ошибка при подтверждении доплаты:', error);
    }
  };

  const handleConfirmRefundExchange = async (exchangeId) => {
    const cryptoTransactionHash = refundTransactionHashes[exchangeId];
    if (!cryptoTransactionHash) {
      message.warning('Введите хэш транзакции возврата');
      return;
    }

    try {
      await exchange.confirmRefund(exchangeId, cryptoTransactionHash);
      message.success('Возврат средств подтвержден');
      setRefundTransactionHashes((prev) => {
        const newState = { ...prev };
        delete newState[exchangeId];
        return newState;
      });
    } catch (error) {
      message.error('Ошибка при подтверждении возврата средств');
      console.error('Ошибка при подтверждении возврата средств:', error);
    }
  };

  if (exchange.loading) {
    return <p>Loading exchanges...</p>;
  }

  return (
    <div className={styles.exchanges}>
      <h3>Новые обмены</h3>
      {exchange.pendingExchanges.length > 0 ? (
        <ListGroup style={{ width: '100%' }}>
          {exchange.pendingExchanges.map((exchangeItem) => {
            const isNewThingUnavailable =
              exchangeItem.NewThing.status !== 'available';
            const currentRefundHash = refundTransactionHashes[exchangeItem.id] || '';

            return (
              <ListGroup.Item
                key={exchangeItem.id}
                className={styles.exchange_item}
              >
                <div className={styles.exchange_details}>
                  <span>Обмен №{exchangeItem.id}</span>
                  <span
                    onClick={() => navigate(`/user/${exchangeItem.userId}`)}
                    style={{ textDecoration: 'underline' }}
                  >
                    User: <p>{exchangeItem.user.email}</p>
                  </span>
                  <span
                    onClick={() =>
                      navigate(THING_ROUTE + '/' + exchangeItem.oldThingId)
                    }
                    style={{ textDecoration: 'underline' }}
                  >
                    Обмен: <p>{exchangeItem.OldThing.name} (${exchangeItem.OldThing.price})</p>
                  </span>
                  <span
                    onClick={() =>
                      navigate(THING_ROUTE + '/' + exchangeItem.newThingId)
                    }
                    style={{ textDecoration: 'underline' }}
                  >
                    На: <p>{exchangeItem.NewThing.name} (${exchangeItem.NewThing.price})</p>
                  </span>
                  <span>
                    Причина: <p>{exchangeItem.userComment}</p>
                  </span>
                  <span>
                    Разница в цене:{' '}
                    <p>
                      $
                      {exchangeItem.priceDifference > 0
                        ? `+${exchangeItem.priceDifference}`
                        : exchangeItem.priceDifference}
                    </p>
                  </span>
                </div>

                {isNewThingUnavailable && (
                  <p style={{ color: 'red' }}>
                    Новый товар недоступен для подтверждения обмена.
                  </p>
                )}

                <div className={styles.confirm_reject}>
                  <button
                    onClick={() => handleApproveExchange(exchangeItem.id)}
                    className={styles.confirm}
                    disabled={isNewThingUnavailable}
                  >
                    Подтвердить
                  </button>
                  <button
                    onClick={() => handleRejectExchange(exchangeItem.id)}
                    className={styles.reject}
                  >
                    Отклонить
                  </button>
                </div>

                {exchangeItem.priceDifference > 0 && !exchangeItem.paymentConfirmed && (
                  <button
                    onClick={() => handleConfirmPaymentExchange(exchangeItem.id)}
                    className={styles.doplata}
                  >
                    Подтвердить доплату
                  </button>
                )}
                {exchangeItem.priceDifference < 0 && !exchangeItem.refundProcessed && (
                  <div className={styles.refund_section}>
                    <Input
                      placeholder="Введите хэш транзакции возврата"
                      value={currentRefundHash}
                      onChange={(e) => {
                        const newHash = e.target.value;
                        setRefundTransactionHashes((prev) => ({
                          ...prev,
                          [exchangeItem.id]: newHash,
                        }));
                      }}
                      style={{ marginBottom: '10px' }}
                    />
                    <button
                      onClick={() => handleConfirmRefundExchange(exchangeItem.id)}
                      className={styles.vozvrat}
                    >
                      Подтвердить возврат
                    </button>
                  </div>
                )}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      ) : (
        <p>Нет обменов на рассмотрении.</p>
      )}
      <Button
        onClick={() => navigate(ALL_EXCHANGES_ROUTE)}
        className={styles.all_btn}
      >
        Посмотреть все обмены
      </Button>
    </div>
  );
});

export default PendingExchanges;
