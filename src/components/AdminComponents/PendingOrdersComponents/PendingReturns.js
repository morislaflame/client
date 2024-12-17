// components/AdminComponents/PendingReturns.js

import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { List, message, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './AdminComponents.module.css';
import { THING_ROUTE } from '../../utils/consts';
import CopyableButton from '../UI/CopyableButton/CopyableButton';

const PendingReturns = observer(() => {
  const { admin } = useContext(Context);
  const [refundTransactionHashes, setRefundTransactionHashes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    admin.loadPendingReturns();
  }, [admin]);

  const handleApproveReturn = async (returnId) => {
    const cryptoTransactionHash = refundTransactionHashes[returnId];
    if (!cryptoTransactionHash) {
      message.warning('Введите хэш транзакции возврата');
      return;
    }

    try {
      await admin.approveReturn(returnId, cryptoTransactionHash);
      message.success('Возврат подтвержден');
      setRefundTransactionHashes((prev) => {
        const newState = { ...prev };
        delete newState[returnId];
        return newState;
      });
      admin.loadPendingReturns();
    } catch (error) {
      message.error('Ошибка при подтверждении возврата');
      console.error('Ошибка при подтверждении возврата:', error);
    }
  };

  const handleRejectReturn = async (returnId) => {
    try {
      await admin.rejectReturn(returnId);
      message.success('Возврат отклонен');
      admin.loadPendingReturns();
    } catch (error) {
      message.error('Ошибка при отклонении возврата');
      console.error('Ошибка при отклонении возврата:', error);
    }
  };

  return (
    <div className={styles.returns}>
      <h3>Новые возвраты</h3>
      {admin.pendingReturns.length > 0 ? (
        <List
          dataSource={admin.pendingReturns}
          renderItem={(returnItem) => {
            const currentRefundHash = refundTransactionHashes[returnItem.id] || '';
            return (
              <List.Item className={styles.return_item}>
                <div className={styles.return_details}>
                  <span>Возврат №{returnItem.id}</span>
                  <span
                    onClick={() => navigate(THING_ROUTE + "/" + returnItem.thingId)}
                    style={{ textDecoration: 'underline' }}
                  >
                    Модель: <p>{returnItem.thing.name}</p>
                  </span>
                  <span
                    onClick={() => navigate(`/user/${returnItem.userId}`)}
                    style={{ textDecoration: 'underline' }}
                  >
                    User: <p>{returnItem.user.email || `@${returnItem.user.username}` || `Telegram ID: ${returnItem.user.telegramId}`}</p>
                  </span>
                  <span><p>{returnItem.reason}</p></span>
                </div>
                <div className={styles.refund_section}>
                  <span className={styles.valuta}>Валюта: <strong>{returnItem.cryptoCurrency}</strong></span>
                  <span className={styles.valuta}>Сумма: <strong>{returnItem.refundAmount}</strong></span>
                  <div className={styles.hash}>
                    <span>Wallet:</span>
                    <CopyableButton
                      value={returnItem.cryptoWalletAddress}
                      className={styles.copyable_address}
                      title='Copy Wallet'
                    />
                  </div>
                  <Input
                    placeholder="Введите хэш транзакции возврата"
                    value={currentRefundHash}
                    onChange={(e) => {
                      const newHash = e.target.value;
                      setRefundTransactionHashes((prev) => ({ ...prev, [returnItem.id]: newHash }));
                    }}
                  />
                </div>
                <div className={styles.confirm_reject}>
                  <button
                    onClick={() => admin.showConfirm(
                      'Подтвердите действие',
                      'Вы уверены, что хотите подтвердить этот возврат?',
                      () => handleApproveReturn(returnItem.id)
                    )}
                    className={styles.confirm}
                  >
                    Подтвердить
                  </button>
                  <button
                    onClick={() => admin.showConfirm(
                      'Подтвердите действие',
                      'Вы уверены, что хотите отклонить этот возврат?',
                      () => handleRejectReturn(returnItem.id)
                    )}
                    className={styles.reject}
                  >
                    Отклонить
                  </button>
                </div>
              </List.Item>
            );
          }}
        />
      ) : (
        <p>Нет возвратов на рассмотрении.</p>
      )}
      <Button onClick={() => navigate('/admin/returns')} className={styles.all_btn}>
        Посмотреть все возвраты
      </Button>
    </div>
  );
});

export default PendingReturns;
