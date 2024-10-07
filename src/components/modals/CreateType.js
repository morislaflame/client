import React, { useState } from "react";
import { Button, Modal, Form, Input, message } from 'antd';
import { createType } from "../../http/thingAPI";

const CreateType = ({ show, onHide }) => {
    const [value, setValue] = useState('');

    const addType = async () => {
        try {
            if (!value.trim()) {
                message.warning('Пожалуйста, введите название страны!');
                return;
            }
            await createType({ name: value });
            setValue('');
            message.success('Страна успешно добавлена!');
            onHide();
        } catch (error) {
            message.error('Ошибка при добавлении страны: ' + (error.response?.data?.message || error.message));
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
                    label="Страна"
                    rules={[{ required: true, message: 'Пожалуйста, введите страну!' }]}
                >
                    <Input
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder="Введите страну"
                    />
                </Form.Item>
                <Form.Item>
                    <Button onClick={onHide} style={{ marginRight: 8 }}>
                        Закрыть
                    </Button>
                    <Button type="primary" onClick={addType}>
                        Добавить
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateType;
