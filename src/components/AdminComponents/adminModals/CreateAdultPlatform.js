// components/modals/CreateAdultPlatform.js

import React, { useState, useContext } from "react";
import { Button, Modal, Form, Input, message } from 'antd';
import { Context } from '../../../index';

const CreateAdultPlatform = ({ show, onHide }) => {
  const { admin } = useContext(Context);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const addAdultPlatform = async () => {
    setLoading(true);
    try {
      if (!value.trim()) {
        message.warning('Пожалуйста, введите название платформы!');
        return;
      }
      await admin.createAdultPlatform({ name: value });
      setValue('');
      message.success('Платформа успешно добавлена!');
      onHide();
    } catch (error) {
      message.error('Ошибка при добавлении платформы: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={show}
      onCancel={onHide}
      footer={null}
      title="Добавить новую платформу"
      centered
    >
      <Form layout="vertical">
        <Form.Item
          label="Название платформы"
          rules={[{ required: true, message: 'Пожалуйста, введите название платформы!' }]}
        >
          <Input
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Введите название платформы"
          />
        </Form.Item>
        <Form.Item>
          <Button onClick={onHide} style={{ marginRight: 8 }}>
            Закрыть
          </Button>
          <Button type="primary" onClick={addAdultPlatform} loading={loading}>
            Добавить
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAdultPlatform;
