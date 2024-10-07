import React, { useState } from "react";
import { Button, Modal, Form, Input, message } from 'antd';
import { createBrand } from "../../http/thingAPI";

const CreateBrand = ({ show, onHide }) => {
    const [value, setValue] = useState('');

    const addBrand = async () => {
        try {
            if (!value.trim()) {
                message.warning('Пожалуйста, введите название бренда!');
                return;
            }
            await createBrand({ name: value });
            setValue('');
            message.success('Бренд успешно добавлен!');
            onHide();
        } catch (error) {
            message.error('Ошибка при добавлении бренда: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <Modal
            open={show}
            onCancel={onHide}
            footer={null}
            title="Добавить новый бренд"
            centered
        >
            <Form layout="vertical">
                <Form.Item
                    label="Название бренда"
                    rules={[{ required: true, message: 'Пожалуйста, введите название бренда!' }]}
                >
                    <Input
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder="Введите название бренда"
                    />
                </Form.Item>
                <Form.Item>
                    <Button onClick={onHide} style={{ marginRight: 8 }}>
                        Закрыть
                    </Button>
                    <Button type="primary" onClick={addBrand}>
                        Добавить
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateBrand;
