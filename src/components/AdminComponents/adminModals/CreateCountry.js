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
        message.warning('Please enter country name!');
        return;
      }
      await admin.createCountry({ name: value });
      setValue('');
      message.success('Country successfully added!');
      onHide();
    } catch (error) {
      message.error('Error adding country: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={show}
      onCancel={onHide}
      footer={null}
      title="Add new country"
      centered
    >
      <Form layout="vertical">
        <Form.Item
          label="Country name"
          rules={[{ required: true, message: 'Please enter country name!' }]}
        >
          <Input
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Enter country name"
          />
        </Form.Item>
        <Form.Item>
          <Button onClick={onHide}>Cancel</Button>
          <Button type="primary" onClick={addCountry} loading={loading}>
            Add
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCountry;
