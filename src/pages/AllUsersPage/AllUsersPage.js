import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../index';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { observer } from 'mobx-react-lite';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton/BackButton';
import styles from './AllUsersPage.module.css'
import { AutoComplete } from 'antd';

const AllUsersPage = observer(() => {
  const { user } = useContext(Context);
  const [userId, setUserId] = useState(''); // Изменено с email на userId
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers(); 
  }, []);

  const loadUsers = async () => {
    await user.fetchAllUsers();
  };

  useEffect(() => {
    if (userId) {
      const filtered = user.users
        .filter(u => u.id.toString().includes(userId)) // Изменено на поиск по ID
        .slice(0, 5);
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [userId, user.users]);

  const handleSearch = async (id) => {
    const result = await user.getUserById(id);
    if (result) {
      navigate(`/user/${result.id}`); 
    }
  };

  const handleEmailClick = (id) => {
    setUserId(id); // Изменено с email на userId
    setFilteredUsers([]);
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

  return (
    <div className={styles.container}>
      <div className={styles.topic_back}>
        <BackButton/>
        <h2>All Users</h2>
      </div>
      
      <div className={styles.search_section}>
        <Form.Group className="mt-3">
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
        </Form.Group>

        <button onClick={() => handleSearch(userId)} className={styles.src_btn}>Найти пользователя</button>
      </div>

      {/* Список всех пользователей */}
      <h3>Пользователи</h3>
      <div className={styles.all_users}>
        {user.users.map((u) => (
          <div key={u.id} className={styles.user}>
            <span>UserName: <strong>{u.email || `@${u.username}` || `Telegram ID: ${u.telegramId}`}</strong></span>
            <span>ID: <strong>{u.id}</strong></span>
            <Form.Check
              type="switch"
              id={`toggle-role-${u.id}`}
              label={u.role === 'USER' ? 'USER' : 'ADMIN'}
              checked={u.role === 'ADMIN'}
              onChange={() => handleRoleChange(u.id, u.role)}
            />
            <div className={styles.buttons}>
              <button onClick={() => navigate(`/user/${u.id}`)} className={styles.u_info}>Посмотреть</button>
              <button onClick={() => confirmDeleteUser(u)} className={styles.u_delete}>Удалить</button>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно для подтверждения удаления */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Вы точно хотите удалить пользователя {userToDelete?.email || `@${userToDelete?.username}` || `Telegram ID: ${userToDelete?.telegramId}`}?
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
