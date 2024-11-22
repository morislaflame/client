// components/modals/CreateCountry.js

import React, { useState, useContext } from "react";
import { Button, Modal, Form, Input, message } from 'antd';
import { Context } from '../../../index';

const CreateCountry = ({ show, onHide }) => {
  const { admin } = useContext(Context);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const addCountry = async () => {
    setLoading(true);
    try {
      if (!value.trim()) {
        message.warning('Пожалуйста, введите название страны!');
        return;
      }
      await admin.createCountry({ name: value });
      setValue('');
      message.success('Страна успешно добавлена!');
      onHide();
    } catch (error) {
      message.error('Ошибка при добавлении страны: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={show}
      onCancel={onHide}
      footer={null}
      title="Добавить новую страну"
      centered
    >
      <Form layout="vertical">
        <Form.Item
          label="Название страны"
          rules={[{ required: true, message: 'Пожалуйста, введите название страны!' }]}
        >
          <Input
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Введите название страны"
          />
        </Form.Item>
        <Form.Item>
          <Button onClick={onHide} style={{ marginRight: 8 }}>
            Закрыть
          </Button>
          <Button type="primary" onClick={addCountry} loading={loading}>
            Добавить
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCountry;
