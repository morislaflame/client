import React, { useContext, useState } from 'react';
import { Modal, Form, Input, Checkbox, message } from 'antd';
import { Context } from '../../../../index';

const { TextArea } = Input;

const BecomeSellerModal = ({ visible, onClose }) => {
    const { user } = useContext(Context);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await user.becomeSeller(values);
            await user.loadUserInfo();
            message.success('Вы успешно стали продавцом!');
            form.resetFields();
            onClose();
            window.location.reload();
        } catch (error) {
            message.error('Произошла ошибка при попытке стать продавцом');
            console.error('Error becoming seller:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Become a seller"
            open={visible}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText="Confirm"
            cancelText="Cancel"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="sellerName"
                    label="Seller name"
                    rules={[
                        { required: true, message: 'Please enter the seller name' },
                        { min: 3, message: 'The name must contain at least 3 characters' }
                    ]}
                >
                    <Input placeholder="Enter your seller name" />
                </Form.Item>

                <Form.Item
                    name="sellerInfo"
                    label="Seller description"
                    rules={[
                        { required: true, message: 'Please add a description' },
                        { min: 20, message: 'The description must contain at least 20 characters' }
                    ]}
                >
                    <TextArea 
                        rows={4} 
                        placeholder="A few words to describe you" 
                    />
                </Form.Item>

                <Form.Item
                    name="isRulesConfirmed"
                    valuePropName="checked"
                    rules={[
                        {
                            validator: (_, value) =>
                                value ? Promise.resolve() : Promise.reject(new Error('You must accept the rules')),
                        },
                    ]}
                >
                    <Checkbox>
                        I accept the rules and conditions of selling products on the platform
                    </Checkbox>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BecomeSellerModal;