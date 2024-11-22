import React, { useState } from "react";
import { Button, Modal, Form, Input, Select, Checkbox, InputNumber, message } from 'antd';
import { createPromoCode, generateOneTimePromoCodes, createPersonalPromoCode } from "../../../http/promocodeAPI";

const { Option } = Select;

const CreatePromoCode = ({ show, onHide }) => {
    const [mode, setMode] = useState('create'); // Режим создания промокодов
    const [code, setCode] = useState('');
    const [discountValue, setDiscountValue] = useState(0);
    const [isOneTime, setIsOneTime] = useState(false);
    const [isPercentage, setIsPercentage] = useState(false); // Новое состояние для процентной скидки
    const [count, setCount] = useState(1); // Для генерации одноразовых промокодов
    const [userId, setUserId] = useState(''); // Для создания персонального промокода
    const [loading, setLoading] = useState(false); // Добавляем состояние для загрузки

    const handleSubmit = async () => {
        setLoading(true); // Устанавливаем состояние загрузки в true
        try {
            if (mode === 'create') {
                // Создание обычного промокода
                await createPromoCode({ code, discountValue, isOneTime, isPercentage });
            } else if (mode === 'generate') {
                // Генерация одноразовых промокодов
                await generateOneTimePromoCodes(count, discountValue);
            } else if (mode === 'personal') {
                // Создание персонального промокода
                await createPersonalPromoCode({ code, discountValue, userId, isPercentage });
            }
            message.success('Промокод успешно создан!');
            onHide(); // Закрываем модальное окно после выполнения действия
        } catch (e) {
            console.error('Ошибка при выполнении операции с промокодом', e);
            message.error('Ошибка при создании промокода: ' + (e.response?.data?.message || e.message));
        } finally {
            setLoading(false); // Возвращаем состояние загрузки в false
        }
    };

    return (
        <Modal
            open={show}
            onCancel={onHide}
            footer={null}
            title={
                mode === 'create' ? 'Создать новый промокод' :
                mode === 'generate' ? 'Генерация одноразовых промокодов' :
                mode === 'personal' ? 'Создать персональный промокод' : ''
            }
            centered
        >
            <Form layout="vertical">
                <Form.Item label="Тип промокода">
                    <Select value={mode} onChange={value => setMode(value)}>
                        <Option value="create">Обычный промокод</Option>
                        <Option value="generate">Генерация одноразовых промокодов</Option>
                        <Option value="personal">Персональный промокод</Option>
                    </Select>
                </Form.Item>

                {mode === 'create' && (
                    <>
                        <Form.Item label="Код промокода">
                            <Input
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                placeholder="Введите код промокода"
                            />
                        </Form.Item>

                        <Form.Item label="Значение скидки">
                            <InputNumber
                                value={discountValue}
                                onChange={value => setDiscountValue(value)}
                                placeholder="Введите размер скидки"
                                style={{ width: '100%' }}
                                min={0}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Checkbox
                                checked={isOneTime}
                                onChange={e => setIsOneTime(e.target.checked)}
                            >
                                Одноразовый промокод
                            </Checkbox>
                        </Form.Item>

                        <Form.Item>
                            <Checkbox
                                checked={isPercentage}
                                onChange={e => setIsPercentage(e.target.checked)}
                            >
                                Процентная скидка
                            </Checkbox>
                        </Form.Item>
                    </>
                )}

                {mode === 'generate' && (
                    <>
                        <Form.Item label="Количество одноразовых промокодов">
                            <InputNumber
                                value={count}
                                onChange={value => setCount(value)}
                                placeholder="Введите количество"
                                style={{ width: '100%' }}
                                min={1}
                            />
                        </Form.Item>

                        <Form.Item label="Значение скидки для всех промокодов">
                            <InputNumber
                                value={discountValue}
                                onChange={value => setDiscountValue(value)}
                                placeholder="Введите размер скидки"
                                style={{ width: '100%' }}
                                min={0}
                            />
                        </Form.Item>
                    </>
                )}

                {mode === 'personal' && (
                    <>
                        <Form.Item label="Код персонального промокода">
                            <Input
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                placeholder="Введите код промокода"
                            />
                        </Form.Item>

                        <Form.Item label="Значение скидки">
                            <InputNumber
                                value={discountValue}
                                onChange={value => setDiscountValue(value)}
                                placeholder="Введите размер скидки"
                                style={{ width: '100%' }}
                                min={0}
                            />
                        </Form.Item>

                        <Form.Item label="ID пользователя">
                            <Input
                                value={userId}
                                onChange={e => setUserId(e.target.value)}
                                placeholder="Введите ID пользователя"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Checkbox
                                checked={isPercentage}
                                onChange={e => setIsPercentage(e.target.checked)}
                            >
                                Процентная скидка
                            </Checkbox>
                        </Form.Item>
                    </>
                )}

                <Form.Item>
                    <Button onClick={onHide} style={{ marginRight: 8 }}>Отмена</Button>
                    <Button type="primary" onClick={handleSubmit} loading={loading}>
                        {mode === 'create' && 'Создать'}
                        {mode === 'generate' && 'Сгенерировать'}
                        {mode === 'personal' && 'Создать персональный промокод'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreatePromoCode;
