import React, { useContext, useState, useEffect, useCallback } from "react";
import { Button, Modal, Form, Input, InputNumber, Select, Row, Col, message, AutoComplete } from 'antd';
import { Context } from "../../../index";
import { fetchBrands, fetchTypes } from '../../../http/thingAPI'; // Импортируем только необходимые функции
import { observer } from "mobx-react-lite";
import ImageUploader from '../../ImageUploader/ImageUploader';

const { Option } = Select;

const CreateSellerModel = observer(({ show, onHide }) => {
    const { thing, user } = useContext(Context);
    const [form] = Form.useForm();
    const [files, setFiles] = useState([]);
    const [info, setInfo] = useState([{
        age: '',
        smartphone: '',
        percent: '',
        time: '',
        english: '',
        content: '',
        contract: '',
        start: '',
        socialmedia: '',
        tiktok: '',
        cblocked: '',
        ofverif: '',
        link: '',
        girlmsg: '',
        number: Date.now(),
    }]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [loading, setLoading] = useState(false); // Добавляем состояние для загрузки

    useEffect(() => {
        const loadData = async () => {
            try {
                const typesData = await fetchTypes();
                thing.setTypes(typesData);
    
                const brandsData = await fetchBrands();
                thing.setBrands(brandsData);
            } catch (error) {
                message.error('Ошибка при загрузке данных: ' + error.message);
            }
        };
        loadData();
    }, [thing]);

    const changeInfo = useCallback((key, value, number) => {
        setInfo(prevInfo =>
            prevInfo.map(i => (i.number === number ? { ...i, [key]: value } : i))
        );
    }, []);

    const handleBrandChange = (value) => {
        setSelectedBrands(thing.brands.filter(brand => value.includes(brand.id)));
    };

    const handleTypeSelect = (value, option) => {
        form.setFieldsValue({ typeId: option.id });
    };

    const addThing = async () => {
        setLoading(true); // Устанавливаем состояние загрузки в true
        try {
            const values = await form.validateFields();

            if (files.length === 0) {
                setLoading(false);
                return message.warning('Добавьте хотя бы одно изображение!');
            }

            const requiredFields = [
                'age',
                'smartphone',
                'percent',
                'time',
                'english',
                'content',
                'contract',
                'start',
                'socialmedia',
                'tiktok',
                'cblocked',
                'ofverif',
                'link',
                'girlmsg',
            ];

            for (let i of info) {
                for (let field of requiredFields) {
                    if (!i[field]?.toString().trim()) {
                        setLoading(false);
                        message.warning('Заполните все поля информации!');
                        return;
                    }
                }
            }

            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('price', values.price);
            formData.append('typeId', values.typeId);
            formData.append('info', JSON.stringify(info));

            const brandIds = selectedBrands.map(b => b.id);
            formData.append('brandIds', JSON.stringify(brandIds));

            files.forEach(file => {
                formData.append('img', file);
            });

            // Используем метод из UserStore для создания модели от имени продавца
            await user.createThing(formData);
            message.success('Модель успешно добавлена!');
            onHide();
            form.resetFields();
            setFiles([]);
            setInfo([]);
            setSelectedBrands([]);
        } catch (error) {
            if (error.errorFields) {
                message.error('Пожалуйста, заполните все обязательные поля!');
            } else {
                message.error('Ошибка при добавлении модели: ' + error.message);
            }
        } finally {
            setLoading(false); // Возвращаем состояние загрузки в false
        }
    };

    const typeOptions = thing.types.map(type => ({
        value: type.name,
        id: type.id,
    }));

    return (
        <Modal
            open={show}
            onCancel={onHide}
            footer={null}
            centered
            title="Добавить новую модель"
            width={800}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Страна"
                    name="typeId"
                    rules={[{ required: true, message: 'Пожалуйста, выберите страну!' }]}
                >
                    <AutoComplete
                        options={typeOptions}
                        placeholder="Начните вводить страну"
                        onSelect={(value, option) => handleTypeSelect(value, option)}
                        filterOption={(inputValue, option) =>
                            option.value.toLowerCase().includes(inputValue.toLowerCase())
                        }
                    />
                </Form.Item>

                <Form.Item
                    name="brandIds"
                    label="Выберите платформы"
                    rules={[{ required: true, message: 'Пожалуйста, выберите платформы' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Выберите платформы"
                        onChange={handleBrandChange}
                    >
                        {thing.brands.map(brand => (
                            <Option value={brand.id} key={brand.id}>
                                {brand.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="name"
                    label="Имя Модели"
                    rules={[{ required: true, message: 'Пожалуйста, введите имя модели' }]}
                >
                    <Input placeholder="Введите имя модели" />
                </Form.Item>
                <Form.Item
                    name="price"
                    label="Цена модели"
                    rules={[{ required: true, message: 'Пожалуйста, введите цену модели!' }]}
                >
                    <InputNumber
                        placeholder="Введите цену модели"
                        min={0}
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item label="Изображения">
                    <ImageUploader images={files} setImages={setFiles} />
                </Form.Item>
                <div style={{ marginBottom: '20px' }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Возраст">
                                <Input
                                    value={info[0].age}
                                    onChange={e => changeInfo('age', e.target.value, info[0].number)}
                                    placeholder="Возраст"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Смартфон">
                                <Input
                                    value={info[0].smartphone}
                                    onChange={e => changeInfo('smartphone', e.target.value, info[0].number)}
                                    placeholder="Смартфон"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Процент">
                                <Input
                                    value={info[0].percent}
                                    onChange={e => changeInfo('percent', e.target.value, info[0].number)}
                                    placeholder="Процент"
                                    suffix="%"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Время">
                                <Input
                                    value={info[0].time}
                                    onChange={e => changeInfo('time', e.target.value, info[0].number)}
                                    placeholder="Время"
                                    suffix="hours"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Английский">
                                <Input
                                    value={info[0].english}
                                    onChange={e => changeInfo('english', e.target.value, info[0].number)}
                                    placeholder="Английский"
                                    suffix="/10"
                                />
                            </Form.Item>
                        </Col><Col span={12}>
                            <Form.Item label="Контент">
                                <Input
                                    value={info[0].content}
                                    onChange={e => changeInfo('content', e.target.value, info[0].number)}
                                    placeholder="Контент"
                                />
                            </Form.Item>
                        </Col><Col span={12}>
                            <Form.Item label="Контракт">
                                <Input
                                    value={info[0].contract}
                                    onChange={e => changeInfo('contract', e.target.value, info[0].number)}
                                    placeholder="Контракт"
                                />
                            </Form.Item>
                        </Col><Col span={12}>
                            <Form.Item label="Когда начнет">
                                <Input
                                    value={info[0].start}
                                    onChange={e => changeInfo('start', e.target.value, info[0].number)}
                                    placeholder="Старт"
                                />
                            </Form.Item>
                        </Col><Col span={12}>
                            <Form.Item label="Соц. сети">
                                <Input
                                    value={info[0].socialmedia}
                                    onChange={e => changeInfo('socialmedia', e.target.value, info[0].number)}
                                    placeholder="Соц. сети"
                                />
                            </Form.Item>
                        </Col><Col span={12}>
                            <Form.Item label="ТикТок">
                                <Input
                                    value={info[0].tiktok}
                                    onChange={e => changeInfo('tiktok', e.target.value, info[0].number)}
                                    placeholder="ТикТок"
                                />
                            </Form.Item>
                        </Col><Col span={12}>
                            <Form.Item label="Блок. страны">
                                <Input
                                    value={info[0].cblocked}
                                    onChange={e => changeInfo('cblocked', e.target.value, info[0].number)}
                                    placeholder="Блок. страны"
                                />
                            </Form.Item>
                        </Col><Col span={12}>
                            <Form.Item label="OF верификация">
                                <Input
                                    value={info[0].ofverif}
                                    onChange={e => changeInfo('ofverif', e.target.value, info[0].number)}
                                    placeholder="OF верификация"
                                />
                            </Form.Item>
                        </Col><Col span={12}>
                            <Form.Item label="Контакт(ссылка)">
                                <Input
                                    value={info[0].link}
                                    onChange={e => changeInfo('link', e.target.value, info[0].number)}
                                    placeholder="Контакт(ссылка)"
                                />
                            </Form.Item>
                        </Col><Col span={12}>
                            <Form.Item label="Доступ к аккаунту?">
                                <Input
                                    value={info[0].girlmsg}
                                    onChange={e => changeInfo('girlmsg', e.target.value, info[0].number)}
                                    placeholder="доступ"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
                <Form.Item>
                    <Button type="primary" onClick={addThing} block loading={loading}>
                        Добавить
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
});

export default CreateSellerModel;
