import React, { useState, useEffect, useContext } from 'react';
import './Admin.css';
import CreateBrand from '../../components/modals/CreateBrand';
import CreateModel from '../../components/modals/CreateModel';
import CreateType from '../../components/modals/CreateType';
import { Context } from '../../index';
import CreateStory from '../../components/modals/CreateStory';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { observer } from 'mobx-react-lite';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { ALL_EXCHANGES_ROUTE, ALL_ORDERS_ROUTE, ALL_RETURNS_ROUTE, ALL_USERS_ROUTE } from '../../utils/consts';
import { fetchNewOrders, confirmOrder, rejectOrder } from '../../http/orderAPI';
import { fetchPendingReturns, approveReturn, rejectReturn } from '../../http/orderAPI';
import { fetchAllExchangeRequests, approveExchangeRequest, rejectExchangeRequest, confirmPayment, confirmRefund } from '../../http/exchangeAPI'; // Импортируем API для обменов

const Admin = observer(() => {
  const [brandVisible, setBrandVisible] = useState(false);
  const [typeVisible, setTypeVisible] = useState(false);
  const [modelVisible, setModelVisible] = useState(false);
  const [storyVisible, setStoryVisible] = useState(false);
  const [pendingReturns, setPendingReturns] = useState([]);
  const [pendingExchanges, setPendingExchanges] = useState([]); // Новое состояние для обменов

  const { user } = useContext(Context);
  const [email, setEmail] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); // Храним пользователя, которого нужно удалить
  const [newOrders, setNewOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers(); // Загружаем список всех пользователей при первом рендере
    loadNewOrders();
    loadPendingReturns();
    loadPendingExchanges(); // Загружаем обмены при монтировании
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
    await user.fetchAllUsers();
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
    if (email) {
      const filtered = user.users
        .filter(u => u.email.toLowerCase().includes(email.toLowerCase()))
        .slice(0, 5); // Показываем до 5 результатов
      setFilteredEmails(filtered);
    } else {
      setFilteredEmails([]);
    }
  }, [email, user.users]);

  const handleSearch = async (email) => {
    const result = await user.searchUserByEmail(email);
    if (result) {
      navigate(`/user/${result.id}`); // Переход на страницу информации о пользователе
    }
  };

  const viewUserInfo = (userId) => {
    navigate(`/user/${userId}`); // Переход на страницу пользователя
  };

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'USER' ? 'ADMIN' : 'USER'; // Переключаем роль
    await user.updateUserRole(userId, newRole);
  };

  const confirmDeleteUser = (user) => {
    setUserToDelete(user); // Устанавливаем пользователя для удаления
    setShowDeleteModal(true); // Показываем модальное окно
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      await user.removeUser(userToDelete.id);
      setShowDeleteModal(false); // Закрываем модальное окно после удаления
      loadUsers(); // Обновляем список пользователей
    }
  };

  const handleEmailClick = (email) => {
    setEmail(email); // Устанавливаем выбранный email
    setFilteredEmails([]); // Очищаем список подсказок
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      await confirmOrder(orderId);
      loadNewOrders(); // Перезагружаем новые заказы после подтверждения
    } catch (error) {
      console.error('Ошибка при подтверждении заказа:', error);
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      await rejectOrder(orderId);
      loadNewOrders(); // Перезагружаем новые заказы после отклонения
    } catch (error) {
      console.error('Ошибка при отклонении заказа:', error);
    }
  };

  const handleApproveReturn = async (returnId) => {
    try {
      await approveReturn(returnId);
      loadPendingReturns(); // Перезагружаем список после подтверждения
    } catch (error) {
      console.error('Ошибка при подтверждении возврата:', error);
    }
  };

  const handleRejectReturn = async (returnId) => {
    try {
      await rejectReturn(returnId);
      loadPendingReturns(); // Перезагружаем список после отклонения
    } catch (error) {
      console.error('Ошибка при отклонении возврата:', error);
    }
  };

  // Функции для управления обменами
  const handleApproveExchange = async (exchangeId) => {
    try {
      await approveExchangeRequest(exchangeId);
      loadPendingExchanges(); // Перезагружаем обмены после подтверждения
    } catch (error) {
      console.error('Ошибка при подтверждении обмена:', error);
    }
  };

  const handleRejectExchange = async (exchangeId) => {
    try {
      await rejectExchangeRequest(exchangeId);
      loadPendingExchanges(); // Перезагружаем обмены после отклонения
    } catch (error) {
      console.error('Ошибка при отклонении обмена:', error);
    }
  };

  const handleConfirmPaymentExchange = async (exchangeId) => {
    try {
      await confirmPayment(exchangeId);
      loadPendingExchanges(); // Перезагружаем обмены после подтверждения доплаты
    } catch (error) {
      console.error('Ошибка при подтверждении доплаты:', error);
    }
  };

  const handleConfirmRefundExchange = async (exchangeId) => {
    try {
      await confirmRefund(exchangeId);
      loadPendingExchanges(); // Перезагружаем обмены после подтверждения возврата
    } catch (error) {
      console.error('Ошибка при подтверждении возврата:', error);
    }
  };

  return (
    <div className={'container'}>
      <h2>Панель администратора</h2>

      {/* Кнопки для добавления новых элементов */}
      <div className="admin-buttons">
        <button onClick={() => setTypeVisible(true)}>Добавить тип</button>
        <button onClick={() => setBrandVisible(true)}>Добавить бренд</button>
        <button onClick={() => setModelVisible(true)}>Добавить модель</button>
        <button onClick={() => setStoryVisible(true)}>Добавить историю</button>
      </div>
      <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)} />
      <CreateModel show={modelVisible} onHide={() => setModelVisible(false)} />
      <CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />
      <CreateStory show={storyVisible} onHide={() => setStoryVisible(false)} />

      {/* Поиск пользователя по email с автозаполнением */}
      <div className="search-section">
        <Form.Group className="mt-3">
          <Form.Control
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        {/* Показываем подсказки только если есть ввод */}
        {filteredEmails.length > 0 && (
          <ListGroup className="mt-2">
            {filteredEmails.map(user => (
              <ListGroup.Item
                key={user.id}
                onClick={() => handleEmailClick(user.email)}
                action
              >
                {user.email}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}

        <button onClick={() => handleSearch(email)}>Найти пользователя</button>

        <Button onClick={() => navigate(ALL_USERS_ROUTE)}>Посмотреть всех пользователей</Button>

        {searchResult && (
          <div className="search-result">
            <p>Пользователь: {searchResult.email}, Роль: {searchResult.role}</p>
            {/* Переключатель для изменения роли */}
            <Form.Check 
              type="switch"
              id={`toggle-role-${searchResult.id}`}
              label={searchResult.role === 'USER' ? 'USER' : 'ADMIN'}
              checked={searchResult.role === 'ADMIN'}
              onChange={() => handleRoleChange(searchResult.id, searchResult.role)}
            />
            <button onClick={() => confirmDeleteUser(searchResult)}>Удалить пользователя</button>
          </div>
        )}
      </div>

      {/* Секция с новыми заказами */}
      <h3>Новые заказы</h3>
      {newOrders.length > 0 ? (
        <ListGroup>
          {newOrders.map(order => (
            <ListGroup.Item key={order.id}>
              Заказ №{order.id}, Сумма: {order.totalPrice}$, Пользователь: {order.user.email}
              <ul>
                {order.order_things.map(item => (
                  <li key={item.id}>Товар: {item.thing.name}, Цена: {item.thing.price}</li>
                ))}
              </ul>
              <Button variant="success" onClick={() => handleConfirmOrder(order.id)}>Подтвердить</Button>
              <Button variant="danger" onClick={() => handleRejectOrder(order.id)} style={{ marginLeft: '10px' }}>Отклонить</Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>Нет новых заказов.</p>
      )}

      <Button onClick={() => navigate(ALL_ORDERS_ROUTE)}>Посмотреть все заказы</Button>

      {/* Секция с возвратами */}
      <h3>Возвраты на рассмотрении</h3>
      {pendingReturns.length > 0 ? (
        <ListGroup>
          {pendingReturns.map(returnItem => (
            <ListGroup.Item key={returnItem.id}>
              Возврат №{returnItem.id}, Товар: {returnItem.thing.name}, Пользователь: {returnItem.user.email}
              <p>Причина: {returnItem.reason}</p>
              <Button variant="success" onClick={() => handleApproveReturn(returnItem.id)}>
                Подтвердить
              </Button>
              <Button variant="danger" onClick={() => handleRejectReturn(returnItem.id)} style={{ marginLeft: '10px' }}>
                Отклонить
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>Нет возвратов на рассмотрении.</p>
      )}


      <Button onClick={() => navigate(ALL_RETURNS_ROUTE)}>Посмотреть все возвраты</Button>

      {/* Секция с обменами */}
      <h3>Обмены на рассмотрении</h3>
      {pendingExchanges.length > 0 ? (
        <ListGroup>
          {pendingExchanges.map(exchange => (
            <ListGroup.Item key={exchange.id}>
              Обмен №{exchange.id}, Пользователь: {exchange.user.email}
              <p>Исходный товар: {exchange.OldThing.name} (${exchange.OldThing.price})</p>
              <p>Новый товар: {exchange.NewThing.name} (${exchange.NewThing.price})</p>
              <p>Комментарий пользователя: {exchange.userComment}</p>
              <p>Разница в цене: {exchange.priceDifference > 0 ? `+${exchange.priceDifference}` : exchange.priceDifference} руб.</p>
              <Button variant="success" onClick={() => handleApproveExchange(exchange.id)}>
                Подтвердить обмен
              </Button>
              <Button variant="danger" onClick={() => handleRejectExchange(exchange.id)} style={{ marginLeft: '10px' }}>
                Отклонить обмен
              </Button>
              {/* Отметка подтверждения доплаты или возврата */}
              {exchange.priceDifference > 0 && !exchange.paymentConfirmed && (
                <Button variant="warning" onClick={() => handleConfirmPaymentExchange(exchange.id)} style={{ marginLeft: '10px' }}>
                  Подтвердить доплату
                </Button>
              )}
              {exchange.priceDifference < 0 && !exchange.refundProcessed && (
                <Button variant="warning" onClick={() => handleConfirmRefundExchange(exchange.id)} style={{ marginLeft: '10px' }}>
                  Подтвердить возврат
                </Button>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>Нет обменов на рассмотрении.</p>
      )}


      <Button onClick={() => navigate(ALL_EXCHANGES_ROUTE)}>Посмотреть все обмены</Button> 
    
      {/* Модальное окно для подтверждения удаления */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Вы точно хотите удалить пользователя {userToDelete?.email}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Отмена
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
});

export default Admin;
