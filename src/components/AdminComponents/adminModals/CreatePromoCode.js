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
                    message.error('Пожалуйста, введите код промокода.');
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
                    message.error('Пожалуйста, введите ID пользователя.');
                    setLoading(false);
                    return;
                }

                await admin.createOneTimePromoCode({
                    forUserId: userId,
                    discountValue,
                    discountType
                });
            }

            message.success('Промокод успешно создан!');
            onHide(); // Закрываем модальное окно
            // Очистка полей формы после успешного создания
            setCode('');
            setDiscountValue(0);
            setIsPercentage(false);
            setUserId('');
        } catch (e) {
            console.error('Ошибка при выполнении операции с промокодом', e);
            message.error('Ошибка при создании промокода: ' + (e.response?.data?.message || e.message));
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
                mode === 'shared' ? 'Создать общий промокод' :
                mode === 'one-time' ? 'Создать одноразовый промокод' : ''
            }
            centered
        >
            <Form layout="vertical">
                <Form.Item label="Тип промокода">
                    <Select value={mode} onChange={value => setMode(value)}>
                        <Option value="shared">Общий промокод</Option>
                        <Option value="one-time">Одноразовый промокод</Option>
                    </Select>
                </Form.Item>

                {mode === 'shared' && (
                    <>
                        <Form.Item label="Код промокода" required>
                            <Input
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                placeholder="Введите код промокода"
                            />
                        </Form.Item>
                    </>
                )}

                {mode === 'one-time' && (
                    <>
                        <Form.Item label="ID пользователя" required>
                            <Input
                                value={userId}
                                onChange={e => setUserId(e.target.value)}
                                placeholder="Введите ID пользователя"
                            />
                        </Form.Item>
                    </>
                )}

                <Form.Item label="Значение скидки" required>
                    <InputNumber
                        value={discountValue}
                        onChange={value => setDiscountValue(value)}
                        placeholder="Введите размер скидки"
                        style={{ width: '100%' }}
                        min={0}
                    />
                </Form.Item>

                <Form.Item label="Тип скидки" required>
                    <Select
                        value={isPercentage ? 'PERCENTAGE' : 'FIXED'}
                        onChange={value => setIsPercentage(value === 'PERCENTAGE')}
                        placeholder="Выберите тип скидки"
                    >
                        <Option value="FIXED">Фиксированная скидка</Option>
                        <Option value="PERCENTAGE">Процентная скидка</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button onClick={onHide} style={{ marginRight: 8 }}>Отмена</Button>
                    <Button type="primary" onClick={handleSubmit} loading={loading}>
                        {mode === 'shared' && 'Создать общий промокод'}
                        {mode === 'one-time' && 'Создать одноразовый промокод'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default observer(CreatePromoCode); // Оборачиваем в observer, если используете MobX
