import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../index';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { observer } from 'mobx-react-lite';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

const AllUsersPage = observer(() => {
  const { user } = useContext(Context);
  const [email, setEmail] = useState('');
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); // Храним пользователя для удаления
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers(); // Загружаем список всех пользователей при первом рендере
  }, []);

  const loadUsers = async () => {
    await user.fetchAllUsers();
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

  return (
    <div className="container">
      <h2>Список всех пользователей</h2>

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
      </div>

      {/* Список всех пользователей */}
      <h3>Пользователи</h3>
      <ul>
        {user.users.map((u) => (
          <li key={u.id}>
            {u.email} — {u.role}
            <Form.Check
              type="switch"
              id={`toggle-role-${u.id}`}
              label={u.role === 'USER' ? 'USER' : 'ADMIN'}
              checked={u.role === 'ADMIN'}
              onChange={() => handleRoleChange(u.id, u.role)}
            />
            <button onClick={() => navigate(`/user/${u.id}`)}>Посмотреть</button>
            <button onClick={() => confirmDeleteUser(u)}>Удалить</button>
          </li>
        ))}
      </ul>

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

export default AllUsersPage;
