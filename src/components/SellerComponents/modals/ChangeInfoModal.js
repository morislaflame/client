import React, { useState, useContext, useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { Context } from '../../../index';

const { TextArea } = Input;

const ChangeInfoModal = ({ visible, onClose }) => {
    const { seller } = useContext(Context);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            seller.loadMyInformation().then(() => {
                const { sellerInformation } = seller.sellerInfo || {};
                if (sellerInformation) {
                  form.setFieldsValue({
                    sellerName: sellerInformation.sellerName || "",
                    sellerInfo: sellerInformation.sellerInfo || "",
                  });
                } else {
                    form.resetFields();
                }
            });
        }
    }, [visible, seller, form]);

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            await seller.updateSellerInfo(formData.sellerName, formData.sellerInfo);
            await seller.loadMyInformation();
            message.success('Информация успешно изменена');
            form.resetFields();
            onClose();
        } catch (error) {
            message.error('Произошла ошибка при попытке изменить информацию');
            console.error('Error changing info:', error);
        } finally {
            setLoading(false);
        }
    };

        return (
            <Modal
                title="Change information"
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
                    >
                        <Input placeholder="Enter your new seller name" />
                    </Form.Item>

                    <Form.Item
                        name="sellerInfo"
                        label="Seller description"
                    >
                        <TextArea rows={4} placeholder="Enter your new seller description" />
                    </Form.Item>
                </Form>
            </Modal>
        )
    }

export default ChangeInfoModal;
