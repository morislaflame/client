import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../index';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { Button, message } from 'antd';
import styles from './AdminComponents.module.css';
import { ALL_USERS_ROUTE } from '../../utils/consts';

const UserSearch = observer(() => {
  const { user } = useContext(Context);
  const [email, setEmail] = useState('');
  const [filteredEmails, setFilteredEmails] = useState([]);
  const navigate = useNavigate();

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
    try {
      const result = await user.searchUserByEmail(email);
      if (result) {
        navigate(`/user/${result.id}`); // Переход на страницу информации о пользователе
      } else {
        message.warning('Пользователь не найден');
      }
    } catch (error) {
      message.error('Ошибка при поиске пользователя');
      console.error('Ошибка при поиске пользователя:', error);
    }
  };

  const handleEmailClick = (email) => {
    setEmail(email); // Устанавливаем выбранный email
    setFilteredEmails([]); // Очищаем список подсказок
  };

  return (
    <div className={styles.search_section}>
      <h3>Найти пользователя</h3>
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
      <button onClick={() => handleSearch(email)} className={styles.src_btn}>Найти пользователя</button>
      <Button onClick={() => navigate(ALL_USERS_ROUTE)} className={styles.all_btn}>Посмотреть всех пользователей</Button>
    </div>
  );
});

export default UserSearch;
