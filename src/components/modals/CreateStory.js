// src/components/modals/CreateStory.js

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { createStory } from '../../http/storyAPI';
import { message } from 'antd';

const CreateStory = ({ show, onHide }) => {
  const [title, setTitle] = useState('');
  const [coverImg, setCoverImg] = useState(null);
  const [mainContent, setMainContent] = useState(null);

  const selectCoverImg = (e) => {
    setCoverImg(e.target.files[0]);
  };

  const selectMainContent = (e) => {
    setMainContent(e.target.files[0]);
  };

  const addStory = () => {
    if (!title.trim()) {
      return message.error('Введите заголовок истории');
    }
    if (!coverImg) {
      return message.error('Выберите обложку истории');
    }
    if (!mainContent) {
      return message.error('Выберите основное содержимое истории (фото или видео)');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('coverImg', coverImg);

    // Проверяем тип файла основного содержимого
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];

    if (allowedImageTypes.includes(mainContent.type)) {
      formData.append('img', mainContent);
    } else if (allowedVideoTypes.includes(mainContent.type)) {
      formData.append('video', mainContent);
    } else {
      return message.error('Неверный формат основного содержимого. Допустимы изображения или видео.');
    }

    createStory(formData)
      .then((data) => {
        message.success('История успешно создана');
        onHide();
        setTitle('');
        setCoverImg(null);
        setMainContent(null);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message;
        message.error('Ошибка при создании истории: ' + errorMessage);
      });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить историю</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-3"
            placeholder="Введите заголовок"
          />
          <Form.Group className="mt-3">
            <Form.Label>Выберите обложку</Form.Label>
            <Form.Control type="file" onChange={selectCoverImg} />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Выберите основное содержимое (фото или видео)</Form.Label>
            <Form.Control type="file" onChange={selectMainContent} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="outline-success" onClick={addStory}>
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateStory;
