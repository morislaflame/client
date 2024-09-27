import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { createPromoCode, generateOneTimePromoCodes, createPersonalPromoCode } from "../../http/promocodeAPI";

const CreatePromoCode = ({ show, onHide }) => {
    const [mode, setMode] = useState('create'); // Режим создания промокодов
    const [code, setCode] = useState('');
    const [discountValue, setDiscountValue] = useState(0);
    const [isOneTime, setIsOneTime] = useState(false);
    const [count, setCount] = useState(1); // Для генерации одноразовых промокодов
    const [userId, setUserId] = useState(''); // Для создания персонального промокода

    const handleSubmit = async () => {
        try {
            if (mode === 'create') {
                // Создание обычного промокода
                await createPromoCode({ code, discountValue, isOneTime });
            } else if (mode === 'generate') {
                // Генерация одноразовых промокодов
                await generateOneTimePromoCodes(count, discountValue);
            } else if (mode === 'personal') {
                // Создание персонального промокода
                await createPersonalPromoCode({ code, discountValue, userId });
            }
            onHide(); // Закрываем модальное окно после выполнения действия
        } catch (e) {
            console.error('Ошибка при выполнении операции с промокодом', e);
        }
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {mode === 'create' && 'Создать новый промокод'}
                    {mode === 'generate' && 'Генерация одноразовых промокодов'}
                    {mode === 'personal' && 'Создать персональный промокод'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="promoCodeForm.Mode">
                        <Form.Label>Тип промокода</Form.Label>
                        <Form.Control as="select" value={mode} onChange={e => setMode(e.target.value)}>
                            <option value="create">Обычный промокод</option>
                            <option value="generate">Генерация одноразовых промокодов</option>
                            <option value="personal">Персональный промокод</option>
                        </Form.Control>
                    </Form.Group>

                    {mode === 'create' && (
                        <>
                            <Form.Group controlId="promoCodeForm.Code">
                                <Form.Label>Код промокода</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={code}
                                    onChange={e => setCode(e.target.value)}
                                    placeholder="Введите код промокода"
                                />
                            </Form.Group>

                            <Form.Group controlId="promoCodeForm.DiscountValue">
                                <Form.Label>Значение скидки</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={discountValue}
                                    onChange={e => setDiscountValue(e.target.value)}
                                    placeholder="Введите размер скидки"
                                />
                            </Form.Group>

                            <Form.Group controlId="promoCodeForm.IsOneTime">
                                <Form.Check
                                    type="checkbox"
                                    label="Одноразовый промокод"
                                    checked={isOneTime}
                                    onChange={e => setIsOneTime(e.target.checked)}
                                />
                            </Form.Group>
                        </>
                    )}

                    {mode === 'generate' && (
                        <>
                            <Form.Group controlId="promoCodeForm.Count">
                                <Form.Label>Количество одноразовых промокодов</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={count}
                                    onChange={e => setCount(e.target.value)}
                                    placeholder="Введите количество"
                                />
                            </Form.Group>

                            <Form.Group controlId="promoCodeForm.DiscountValue">
                                <Form.Label>Значение скидки для всех промокодов</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={discountValue}
                                    onChange={e => setDiscountValue(e.target.value)}
                                    placeholder="Введите размер скидки"
                                />
                            </Form.Group>
                        </>
                    )}

                    {mode === 'personal' && (
                        <>
                            <Form.Group controlId="promoCodeForm.Code">
                                <Form.Label>Код персонального промокода</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={code}
                                    onChange={e => setCode(e.target.value)}
                                    placeholder="Введите код промокода"
                                />
                            </Form.Group>

                            <Form.Group controlId="promoCodeForm.DiscountValue">
                                <Form.Label>Значение скидки</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={discountValue}
                                    onChange={e => setDiscountValue(e.target.value)}
                                    placeholder="Введите размер скидки"
                                />
                            </Form.Group>

                            <Form.Group controlId="promoCodeForm.UserId">
                                <Form.Label>ID пользователя</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={userId}
                                    onChange={e => setUserId(e.target.value)}
                                    placeholder="Введите ID пользователя"
                                />
                            </Form.Group>
                        </>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Отмена</Button>
                <Button variant="primary" onClick={handleSubmit}>
                    {mode === 'create' && 'Создать'}
                    {mode === 'generate' && 'Сгенерировать'}
                    {mode === 'personal' && 'Создать персональный промокод'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreatePromoCode;
