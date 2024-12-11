import React, { useState, useContext } from "react";
import { observer } from "mobx-react-lite"; // Если вы используете MobX
import { Button, Modal, Form, Input, Select, InputNumber, message } from 'antd';
import { Context } from "../../../index";

const { Option } = Select;

const CreatePromoCode = ({ show, onHide }) => {
    const { admin } = useContext(Context);

    const [mode, setMode] = useState('shared'); // Режим создания промокодов: 'shared' или 'one-time'
    const [code, setCode] = useState('');
    const [discountValue, setDiscountValue] = useState(0);
    const [isPercentage, setIsPercentage] = useState(false); // Для определения типа скидки
    const [userId, setUserId] = useState(''); // Для создания одноразового промокода
    const [loading, setLoading] = useState(false); // Состояние загрузки

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const discountType = isPercentage ? 'PERCENTAGE' : 'FIXED'; // Определяем тип скидки

            if (mode === 'shared') {
                // Создание общего промокода
                if (!code) {
                    message.error('Please enter promo code.');
                    setLoading(false);
                    return;
                }

                await admin.createSharedPromoCode({
                    code,
                    discountValue,
                    discountType
                });
            } else if (mode === 'one-time') {
                // Создание одноразового промокода
                if (!userId) {
                    message.error('Please enter user ID.');
                    setLoading(false);
                    return;
                }

                await admin.createOneTimePromoCode({
                    forUserId: userId,
                    discountValue,
                    discountType
                });
            }

            message.success('Promo code successfully created!');
            onHide(); // Закрываем модальное окно
            // Очистка полей формы после успешного создания
            setCode('');
            setDiscountValue(0);
            setIsPercentage(false);
            setUserId('');
        } catch (e) {
            console.error('Error creating promo code', e);
            message.error('Error creating promo code: ' + (e.response?.data?.message || e.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={show}
            onCancel={onHide}
            footer={null}
            title={
                mode === 'shared' ? 'Create shared promo code' :
                mode === 'one-time' ? 'Create one-time promo code' : ''
            }
            centered
        >
            <Form layout="vertical">
                <Form.Item label="Promo code type">
                    <Select value={mode} onChange={value => setMode(value)}>
                        <Option value="shared">Shared promo code</Option>
                        <Option value="one-time">One-time promo code</Option>
                    </Select>
                </Form.Item>

                {mode === 'shared' && (
                    <>
                        <Form.Item label="Promo code" required>
                            <Input
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                placeholder="Enter promo code"
                            />
                        </Form.Item>
                    </>
                )}

                {mode === 'one-time' && (
                    <>
                        <Form.Item label="User ID" required>
                            <Input
                                value={userId}
                                onChange={e => setUserId(e.target.value)}
                                placeholder="Enter user ID"
                            />
                        </Form.Item>
                    </>
                )}

                <Form.Item label="Discount value" required>
                    <InputNumber
                        value={discountValue}
                        onChange={value => setDiscountValue(value)}
                        placeholder="Enter discount value"
                        style={{ width: '100%' }}
                        min={0}
                    />
                </Form.Item>

                <Form.Item label="Discount type" required>
                    <Select
                        value={isPercentage ? 'PERCENTAGE' : 'FIXED'}
                        onChange={value => setIsPercentage(value === 'PERCENTAGE')}
                        placeholder="Select discount type"
                    >
                        <Option value="FIXED">Fixed discount</Option>
                        <Option value="PERCENTAGE">Percentage discount</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button onClick={onHide} style={{ marginRight: 8 }}>Cancel</Button>
                    <Button type="primary" onClick={handleSubmit} loading={loading}>
                        {mode === 'shared' && 'Create shared promo code'}
                        {mode === 'one-time' && 'Create one-time promo code'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default observer(CreatePromoCode); // Оборачиваем в observer, если используете MobX
