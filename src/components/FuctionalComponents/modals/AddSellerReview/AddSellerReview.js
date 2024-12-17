import React, { useContext, useState, useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import StarRatingInput from '../../StarRatingInput/StarRatingInput';
import { Context } from '../../../../index';
import { observer } from 'mobx-react-lite';

const AddSellerReview = ({ visible, onClose, sellerId }) => {
    const { seller } = useContext(Context);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await seller.addSellerReview(sellerId, values);
            await seller.loadSellerReviews(sellerId);
            message.success('Отзыв успешно добавлен!');
            form.resetFields();
            onClose();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Произошла ошибка при попытке добавить отзыв';
            message.error(errorMessage);
            console.error('Error adding seller review:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!visible) {
            form.resetFields();
        }
    }, [visible, form]);

    return (
        <Modal
            title="Добавить отзыв"
            open={visible}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText="Отправить"
            cancelText="Отмена"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="text"
                    label="Текст отзыва"
                    rules={[{ required: true, message: "Пожалуйста, введите текст отзыва" }]}
                >
                    <Input.TextArea placeholder="Введите ваш отзыв" />
                </Form.Item>

                <Form.Item
                    name="rating"
                    label="Рейтинг"
                    rules={[{ required: true, message: "Пожалуйста, поставьте рейтинг" }]}
                >
                    <StarRatingInput />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default observer(AddSellerReview);
