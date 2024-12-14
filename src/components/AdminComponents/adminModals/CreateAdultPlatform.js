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
        message.warning('Platform name is required');
        return;
      }
      await admin.createAdultPlatform({ name: value });
      setValue('');
      message.success('Platform successfully added!');
      onHide();
    } catch (error) {
      message.error('Error adding platform: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={show}
      onCancel={onHide}
      footer={null}
      title="Add new platform"
      centered
    >
      <Form layout="vertical">
        <Form.Item
          label="Platform name"
          rules={[{ required: true, message: 'Please enter platform name!' }]}
        >
          <Input
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Enter platform name"
          />
        </Form.Item>
        <Form.Item>
          <Button onClick={onHide}>Cancel</Button>
          <Button type="primary" onClick={addAdultPlatform} loading={loading}>
            Add
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAdultPlatform;
