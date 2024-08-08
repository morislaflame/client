// src/components/modals/CreateStory.js
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { createStory } from '../../http/storyAPI';

const CreateStory = ({ show, onHide }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);

  const selectFile = e => {
    setFile(e.target.files[0]);
  };

  const addStory = () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('img', file);
    createStory(formData).then(data => onHide());
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
            onChange={e => setTitle(e.target.value)}
            className="mt-3"
            placeholder="Введите заголовок"
          />
          <Form.Control className="mt-3" type="file" onChange={selectFile} />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
        <Button variant="outline-success" onClick={addStory}>Добавить</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateStory;