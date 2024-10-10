// components/Admin/PendingReturns.js

import React, { useEffect, useState, useContext } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { message, Input } from 'antd';
import { THING_ROUTE, ALL_RETURNS_ROUTE } from '../../utils/consts';
import styles from './AdminComponents.module.css';

const PendingReturns = observer(() => {
  const { return: returnStore } = useContext(Context);
  const [refundTransactionHashes, setRefundTransactionHashes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    returnStore.loadPendingReturns(); // Метод в ReturnStore для загрузки ожидающих возвратов
  }, [returnStore]);

  const handleApproveReturn = async (returnId) => {
    const cryptoTransactionHash = refundTransactionHashes[returnId];
    if (!cryptoTransactionHash) {
      message.warning('Введите хэш транзакции возврата');
      return;
    }

    try {
      await returnStore.approveExistingReturn(returnId, cryptoTransactionHash);
      message.success('Возврат подтвержден');
      setRefundTransactionHashes((prev) => {
        const newState = { ...prev };
        delete newState[returnId];
        return newState;
      });
    } catch (error) {
      message.error('Ошибка при подтверждении возврата');
      console.error('Ошибка при подтверждении возврата:', error);
    }
  };

  const handleRejectReturn = async (returnId) => {
    try {
      await returnStore.rejectExistingReturn(returnId);
      message.success('Возврат отклонен');
    } catch (error) {
      message.error('Ошибка при отклонении возврата');
      console.error('Ошибка при отклонении возврата:', error);
    }
  };

  if (returnStore.loading) {
    return <p>Loading returns...</p>;
  }

  return (
    <div className={styles.returns}>
      <h3>Новые возвраты</h3>
      {returnStore.pendingReturns.length > 0 ? (
        <ListGroup style={{ width: '100%' }}>
          {returnStore.pendingReturns.map((returnItem) => {
            const currentRefundHash = refundTransactionHashes[returnItem.id] || '';
            return (
              <ListGroup.Item key={returnItem.id} className={styles.return_item}>
                <div className={styles.return_details}>
                  <span>Возврат №{returnItem.id}</span>
                  <span
                    onClick={() => navigate(THING_ROUTE + '/' + returnItem.thingId)}
                    style={{ textDecoration: 'underline' }}
                  >
                    Модель: <p>{returnItem.thing.name}</p>
                  </span>
                  <span
                    onClick={() => navigate(`/user/${returnItem.userId}`)}
                    style={{ textDecoration: 'underline' }}
                  >
                    User: <p>{returnItem.user.email}</p>
                  </span>
                  <span>
                    Причина: <p>{returnItem.reason}</p>
                  </span>
                </div>
                <Input
                  placeholder="Введите хэш транзакции возврата"
                  value={currentRefundHash}
                  onChange={(e) => {
                    const newHash = e.target.value;
                    setRefundTransactionHashes((prev) => ({
                      ...prev,
                      [returnItem.id]: newHash,
                    }));
                  }}
                  style={{ marginBottom: '10px' }}
                />
                <div className={styles.confirm_reject}>
                  <button
                    onClick={() => handleApproveReturn(returnItem.id)}
                    className={styles.confirm}
                  >
                    Подтвердить
                  </button>
                  <button
                    onClick={() => handleRejectReturn(returnItem.id)}
                    className={styles.reject}
                  >
                    Отклонить
                  </button>
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      ) : (
        <p>Нет возвратов на рассмотрении.</p>
      )}
      <Button
        onClick={() => navigate(ALL_RETURNS_ROUTE)}
        className={styles.all_btn}
      >
        Посмотреть все возвраты
      </Button>
    </div>
  );
});

export default PendingReturns;
