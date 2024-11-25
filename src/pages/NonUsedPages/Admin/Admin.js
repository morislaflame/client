import React, { useState, useEffect, useContext } from 'react';
import CreateBrand from '../../../components/AdminComponents/adminModals/CreateAdultPlatform';
// import CreateModel from '../../components/AdminComponents/adminModals/CreateModel';
import CreateType from '../../../components/AdminComponents/adminModals/CreateCountry';
import { Context } from '../../../index';
import CreateStory from '../../../components/AdminComponents/adminModals/CreateStory';
import ListGroup from 'react-bootstrap/ListGroup';
import { observer } from 'mobx-react-lite';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { ALL_EXCHANGES_ROUTE, ALL_ORDERS_ROUTE, ALL_RETURNS_ROUTE, THING_ROUTE, ALL_USERS_ROUTE } from '../../../utils/consts';
import { fetchNewOrders, confirmOrder, rejectOrder } from '../../../http/orderAPI';
import { fetchPendingReturns, approveReturn, rejectReturn } from '../../../http/orderAPI';
import { fetchAllExchangeRequests, approveExchangeRequest, rejectExchangeRequest, confirmPayment, confirmRefund } from '../../../http/NonUsedAPI/exchangeAPI'; // Импортируем API для обменов
import CreatePromoCode from '../../../components/AdminComponents/adminModals/CreatePromoCode';
import styles from './Admin.module.css'
import { message, Input, Modal as AntdModal, AutoComplete, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import CopyableButton from '../../../components/UI/CopyableButton/CopyableButton';

const { confirm } = AntdModal;

const Admin = observer(() => {
  const [brandVisible, setBrandVisible] = useState(false);
  const [typeVisible, setTypeVisible] = useState(false);
  const [modelVisible, setModelVisible] = useState(false);
  const [storyVisible, setStoryVisible] = useState(false);
  const [promoVisible, setPromoVisible] = useState(false);
  const [pendingReturns, setPendingReturns] = useState([]);
  const [pendingExchanges, setPendingExchanges] = useState([]);

  const { user } = useContext(Context);
  const [userId, setUserId] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [newOrders, setNewOrders] = useState([]);
  const [refundTransactionHashes, setRefundTransactionHashes] = useState({});

  const navigate = useNavigate();

  const [isSearching, setIsSearching] = useState(false); // Добавлено состояние для анимации загрузки

  useEffect(() => {
    const loadAllData = async () => {
      try {
        await Promise.all([loadUsers(), loadNewOrders(), loadPendingReturns(), loadPendingExchanges()]);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };
    loadAllData();
  }, []);

  const loadPendingExchanges = async () => {
    try {
      const exchanges = await fetchAllExchangeRequests('pending');
      setPendingExchanges(exchanges);
    } catch (error) {
      console.error('Ошибка при загрузке обменов:', error);
    }
  };
  
  const loadPendingReturns = async () => {
    try {
      const returns = await fetchPendingReturns();
      setPendingReturns(returns);
    } catch (error) {
      console.error('Ошибка при загрузке возвратов:', error);
    }
  };

  const loadUsers = async () => {
    try {
      await user.fetchAllUsers();
    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error);
      message.error('Ошибка при загрузке пользователей');
    }
  };

  const loadNewOrders = async () => {
    try {
      const orders = await fetchNewOrders();
      setNewOrders(orders);
    } catch (error) {
      console.error('Ошибка при загрузке новых заказов:', error);
    }
  };


  // Обновляем список подходящих пользователей при изменении введённого email
  useEffect(() => {
    if (userId) {
      const filtered = user.users
        .filter(u => u.id.toString().includes(userId))
        .slice(0, 5);
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [userId, user.users]);

  const handleSearch = async (id) => {
    setIsSearching(true); // Устанавливаем состояние загрузки в true
    try {
      const result = await user.getUserById(id);
      if (result) {
        navigate(`/user/${result.id}`);
      }
    } catch (error) {
      console.error('Ошибка при поиске пользователя:', error);
      message.error('Пользователь не найден');
    } finally {
      setIsSearching(false); // Устанавливаем состояние загрузки в false после завершения
    }
  };


  const showConfirm = (title, content, onOk) => {
    confirm({
      title,
      content,
      onOk,
      okText: 'Да',
      cancelText: 'Нет',
    });
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      await confirmOrder(orderId);
      message.success('Заказ подтвержден');
      loadNewOrders(); // Перезагружаем новые заказы после подтверждения
    } catch (error) {
      message.error('Ошибка при подтверждении заказа');
      console.error('Ошибка при подтверждении заказа:', error);
    }
  };


  const handleRejectOrder = async (orderId) => {
    try {
      await rejectOrder(orderId);
      message.success('Заказ отклонен');
      loadNewOrders(); // Перезагружаем новые заказы после отклонения
    } catch (error) {
      message.error('Ошибка при отклонении заказа');
      console.error('Ошибка при отклонении заказа:', error);
    }
  };

  const handleApproveReturn = async (returnId) => {
    const cryptoTransactionHash = refundTransactionHashes[returnId];
    if (!cryptoTransactionHash) {
      message.warning('Введите хэш транзакции возврата');
      return;
    }
  
    try {
      await approveReturn(returnId, cryptoTransactionHash);
      message.success('Возврат подтвержден');
      // Удаляем хэш из состояния после подтверждения
      setRefundTransactionHashes((prev) => {
        const newState = { ...prev };
        delete newState[returnId];
        return newState;
      });
      loadPendingReturns();
    } catch (error) {
      message.error('Ошибка при подтверждении возврата');
      console.error('Ошибка при подтверждении возврата:', error);
    }
  };
  

  const handleRejectReturn = async (returnId) => {
    try {
      await rejectReturn(returnId);
      message.success('Возврат отклонен');
      loadPendingReturns(); // Перезагружаем список после отклонения
    } catch (error) {
      message.error('Ошибка при отклонении возврата');
      console.error('Ошибка при отклонении возврата:', error);
    }
  };

  // Функции для управления обменами
  const handleApproveExchange = async (exchangeId) => {
    try {
      await approveExchangeRequest(exchangeId);
      message.success('Обмен подтвержден');
      loadPendingExchanges(); // Перезагружаем обмены после подтверждения
    } catch (error) {
      message.error('Ошибка при подтверждении обмена');
      console.error('Ошибка при подтверждении обмена:', error);
    }
  };

  const handleRejectExchange = async (exchangeId) => {
    try {
      await rejectExchangeRequest(exchangeId);
      message.success('Обмен отклонен');
      loadPendingExchanges(); // Перезагружаем обмены после отклонения
    } catch (error) {
      message.error('Ошибка при отклонении обмена');
      console.error('Ошибка при отклонении обмена:', error);
    }
  };

  const handleConfirmPaymentExchange = async (exchangeId) => {
    try {
      await confirmPayment(exchangeId);
      message.success('Доплата подтверждена');
      loadPendingExchanges(); // Перезагружаем обмены после подтверждения доплаты
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
      await confirmRefund(exchangeId, cryptoTransactionHash);
      message.success('Возврат средств подтвержден');
      // Удаляем хэш из состояния после подтверждения
      setRefundTransactionHashes(prev => {
        const newState = { ...prev };
        delete newState[exchangeId];
        return newState;
      });
      loadPendingExchanges();
    } catch (error) {
      message.error('Ошибка при подтверждении возврата средств');
      console.error('Ошибка при подтверждении возврата средств:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Admin панель</h2>

      <div className={styles.admin_buttons}>
        <button onClick={() => setTypeVisible(true)}>Добавить страну</button>
        <button onClick={() => setBrandVisible(true)}>Добавить бренд</button>
        <button onClick={() => setStoryVisible(true)}>Добавить историю</button>
        <button onClick={() => setPromoVisible(true)}>Добавить промокод</button>
        <button onClick={() => setModelVisible(true)}>Добавить модель</button>
      </div>
      <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)} />
      {/* <CreateModel show={modelVisible} onHide={() => setModelVisible(false)} /> */}
      <CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />
      <CreateStory show={storyVisible} onHide={() => setStoryVisible(false)} />
      <CreatePromoCode show={promoVisible} onHide={() => setPromoVisible(false)}/>

      <div className={styles.search_section}>
        <h3>Найти пользователя по ID</h3>
        <AutoComplete
          style={{ width: '100%' }}
          options={filteredUsers.map(u => ({
            value: u.id.toString(),
            label: `ID: ${u.id} - ${u.email || `@${u.username}` || `Telegram ID: ${u.telegramId}`}`
          }))}
          value={userId}
          onChange={setUserId}
          onSelect={handleSearch}
          placeholder="Введите ID пользователя"
        />
        <button
          onClick={() => navigate(ALL_USERS_ROUTE)}
          className={styles.all_btn}
          disabled={isSearching} // Блокируем кнопку при загрузке
        >
          {isSearching ? <Spin indicator={<LoadingOutlined style={{color: 'white'}} spin />}/> : 'Все пользователи'} 
        </button>
      </div>

      {/* Секция с новыми заказами */}
      <div className={styles.orders}>
        <h3>Новые заказы</h3>
        {newOrders.length > 0 ? (
          <ListGroup style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {newOrders.map(order => {
              // Проверка статуса товаров в заказе
              const hasUnavailableItems = order.order_things.some(item => item.thing.status !== 'available');
              return (
                <ListGroup.Item key={order.id} className={styles.order_item}>
                  <div className={styles.order_details}>
                    <span>Заказ №{order.id}</span> 
                    <span 
                      onClick={() => navigate(`/user/${order.userId}`)} 
                      style={{textDecoration: 'underline'}}
                    >
                      User: <p>{order.user.email || `@${order.user.username}` || `Telegram ID: ${order.user.telegramId}`}</p> 
                    </span>
                    {order.promo_code ? (
                        <span>
                            Promocode: <p>{order.promo_code.code}</p> - <p>{order.promo_code.isPercentage ? `${order.promo_code.discountValue}%` : `$${order.promo_code.discountValue}`}</p>
                        </span>
                    ) : (
                        <></>
                    )}
                    <div className={styles.order_things}>
                  {order.order_things.map(item => (
                      <span 
                        key={item.id} 
                        className={styles.name_price} 
                        onClick={() => navigate(THING_ROUTE + "/" + item.thingId)}
                      >
                      {item.thing.name} ${item.thing.price}</span>
                    ))}
                    <span className={styles.total_price}>Total: ${order.totalPrice}</span>
                    </div>
                  </div>
                  
                  <div className={styles.refund_section}>
                    <span className={styles.valuta}>Валюта: <strong>{order.cryptoCurrency}</strong></span>
                    <span className={styles.valuta}>Сумма: <strong>{order.cryptoPaymentAmount}</strong></span>
                    <div className={styles.hash}>
                      <span>Transaction Hash:</span> 
                      <CopyableButton 
                        value={order.cryptoTransactionHash} 
                        className={styles.copyable_address}
                        title='Copy Hash'
                      />
                      </div>
                    </div>
                    {hasUnavailableItems && (
                      <p style={{ color: 'red' }}>Некоторые товары в этом заказе недоступны для подтверждения.</p>
                    )}
                    <div className={styles.confirm_reject}>
                      <button 
                        onClick={() => showConfirm(
                          'Подтвердите действие',
                          'Вы уверены, что хотите подтвердить этот заказ?',
                          () => handleConfirmOrder(order.id)
                        )} 
                        className={styles.confirm}
                        disabled={hasUnavailableItems}
                      >
                        Подтвердить
                      </button>
                      <button 
                        onClick={() => showConfirm(
                          'Подтвердите действие',
                          'Вы уверены, что хотите отклонить этот заказ?',
                          () => handleRejectOrder(order.id)
                        )} 
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
          <p>Нет новых заказов.</p>
        )}
        <Button onClick={() => navigate(ALL_ORDERS_ROUTE)} className={styles.all_btn}>Посмотреть все заказы</Button>
      </div>
      
      {/* Секция с возвратами */}
      <div className={styles.returns}>
        <h3>Новые возвраты</h3>
        {pendingReturns.length > 0 ? (
          <ListGroup style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {pendingReturns.map(returnItem => {
                const currentRefundHash = refundTransactionHashes[returnItem.id] || '';
                return (
                  <ListGroup.Item key={returnItem.id} className={styles.return_item}>
                    <div className={styles.return_details}>
                      <span>Возврат №{returnItem.id}</span>
                      <span onClick={() => navigate(THING_ROUTE + "/" + returnItem.thingId)} style={{ textDecoration: 'underline' }}>Модель: <p>{returnItem.thing.name}</p></span>
                      <span onClick={() => navigate(`/user/${returnItem.userId}`)} style={{ textDecoration: 'underline' }}>User: <p>{returnItem.user.email || `@${returnItem.user.username}` || `Telegram ID: ${returnItem.user.telegramId}`}</p></span>
                      
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
                        title='Copy Hash'
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
                        variant="success" 
                        onClick={() => showConfirm(
                          'Подтвердите действие',
                          'Вы уверены, что хотите подтвердить этот возврат?',
                          () => handleApproveReturn(returnItem.id)
                        )}
                        className={styles.confirm}
                      >
                        Подтвердить
                      </button>
                      <button 
                        variant="danger" 
                        onClick={() => showConfirm(
                          'Подтвердите действие',
                          'Вы уверены, что хотите отклонить этот возврат?',
                          () => handleRejectReturn(returnItem.id)
                        )}
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
        <Button onClick={() => navigate(ALL_RETURNS_ROUTE)} className={styles.all_btn}>Посмотреть все возвраты</Button>
      </div>
    

      {/* Секция с обменами */}
      <div className={styles.returns}>
        <h3>Новые обмены</h3>
        {pendingExchanges.length > 0 ? (
          <ListGroup style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pendingExchanges.map(exchange => {
              const isNewThingUnavailable = exchange.NewThing.status !== 'available';
              const currentRefundHash = refundTransactionHashes[exchange.id] || '';

              return (
                <ListGroup.Item key={exchange.id} className={styles.exhange_item}>
                  <div className={styles.return_details}>
                    <span>Обмен №{exchange.id}</span>
                    <span onClick={() => navigate(`/user/${exchange.userId}`)} style={{ textDecoration: 'underline' }}>
                      User: <p>{exchange.user.email || `@${exchange.user.username}` || `Telegram ID: ${exchange.user.telegramId}`}</p>
                    </span>
                    <span onClick={() => navigate(THING_ROUTE + "/" + exchange.oldThingId)} style={{ textDecoration: 'underline' }}>
                      Обмен: <p>{exchange.OldThing.name} (${exchange.OldThing.price})</p>
                    </span>
                    <span onClick={() => navigate(THING_ROUTE + "/" + exchange.newThingId)} style={{ textDecoration: 'underline' }}>
                      На: <p>{exchange.NewThing.name} (${exchange.NewThing.price})</p>
                    </span>
                    
                    <span>Разница в цене: <p>${exchange.priceDifference > 0 ? `+${exchange.priceDifference}` : exchange.priceDifference}</p></span>
                    <span>{exchange.userComment}</span>
                  </div>

                  {isNewThingUnavailable && (
                    <p style={{ color: 'red' }}>Новый товар недоступен для подтверждения обмена.</p>
                  )}

                  {exchange.priceDifference > 0 && !exchange.paymentConfirmed && (
                    <>
                    <span className={styles.valuta}>Валюта: <strong>{exchange.cryptoCurrency}</strong></span>
                    
                      <div className={styles.hash}>
                        <span>Transaction Hash:</span> 
                        <CopyableButton 
                        value={exchange.cryptoTransactionHash} 
                        className={styles.copyable_address}
                        title='Copy Hash'
                        />
                      </div>
                      <button 
                        onClick={() => showConfirm(
                          'Подтверждение доплаты',
                          'Вы уверены, что хотите подтвердить доплату?',
                          () => handleConfirmPaymentExchange(exchange.id)
                        )} 
                        className={styles.doplata}
                      >
                          Подтвердить доплату
                      </button>
                    </>
                  )}
                  {exchange.priceDifference < 0 && !exchange.refundProcessed && (
                    <div className={styles.refund_section}>
                      <span className={styles.valuta}>Валюта: <strong>{exchange.cryptoCurrency}</strong></span>
                      <span className={styles.valuta}>Сумма: <strong>{exchange.cryptoPaymentAmount}</strong></span>
                      <div className={styles.hash}>
                        <span>Wallet:</span> 
                        <CopyableButton 
                        value={exchange.cryptoWalletAddress} 
                        className={styles.copyable_address}
                        title='Copy Hash'
                        />
                      </div>
                      <Input
                        placeholder="Введите хэш транзакции возврата"
                        value={currentRefundHash}
                        onChange={(e) => {
                          const newHash = e.target.value;
                          setRefundTransactionHashes(prev => ({ ...prev, [exchange.id]: newHash }));
                        }}
                      />
                      <button 
                        onClick={() => showConfirm(
                          'Подтверждение возврата',
                          'Вы уверены, что хотите подтвердить возврат средств?',
                          () => handleConfirmRefundExchange(exchange.id)
                        )}
                        className={styles.vozvrat}
                      >
                        Подтвердить возврат
                      </button>
                    </div>
                  )}

                  <div className={styles.confirm_reject}>
                    <button
                      onClick={() => showConfirm(
                        'Подтвердите действие',
                        'Вы уверены, что хотите подтвердить этот обмен?',
                        () => handleApproveExchange(exchange.id)
                      )}
                      className={styles.confirm}
                      disabled={isNewThingUnavailable}
                    >
                      Подтвердить
                    </button>
                    <button 
                      onClick={() => showConfirm(
                        'Подтвердите действие',
                        'Вы уверены, что хотите отклонить этот обмен?',
                        () => handleRejectExchange(exchange.id)
                      )}
                      className={styles.reject}
                    >
                      Отклонить
                    </button>
                  </div>

                  {/* Дополнительные действия для доплаты или возврата */}
                  
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        ) : (
          <p>Нет обменов на рассмотрении.</p>
        )}

        <Button onClick={() => navigate(ALL_EXCHANGES_ROUTE)} className={styles.all_btn}>Посмотреть все обмены</Button>
      </div>
    </div>
  );
});


export default Admin;
