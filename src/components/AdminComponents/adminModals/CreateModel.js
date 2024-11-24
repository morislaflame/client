import React, { useContext, useState, useEffect, useCallback } from "react";
import { Button, Modal, Form, Input, InputNumber, Select, Row, Col, message, AutoComplete, Checkbox } from 'antd';
import { Context } from "../../../index";
import { createThing, fetchBrands, fetchTypes } from '../../../http/thingAPI';
import { observer } from "mobx-react-lite";
import ImageUploader from '../../UI/ImageUploader/ImageUploader';
import { fetchScouts } from '../../../http/scoutAPI';

const { Option } = Select;

const CreateModel = observer(({ show, onHide }) => {
    const { thing } = useContext(Context);
    const [form] = Form.useForm();
    const [files, setFiles] = useState([]);
    const [info, setInfo] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [scouts, setScouts] = useState([]);
    const [isScoutModel, setIsScoutModel] = useState(false);
    const [loading, setLoading] = useState(false); // Добавляем состояние для загрузки


    useEffect(() => {
        const loadData = async () => {
            try {
                const typesData = await fetchTypes();
                thing.setTypes(typesData);
    
                const brandsData = await fetchBrands();
                thing.setBrands(brandsData);
    
                const scoutsData = await fetchScouts(); // Загружаем скаутов
                setScouts(scoutsData);
            } catch (error) {
                message.error('Ошибка при загрузке данных: ' + error.message);
            }
        };
        loadData();
    }, [thing]);    

    const addInfo = () => {
        setInfo(prevInfo => [
            ...prevInfo,
            {
                age: '',
                smartphone: 'iPhone',
                percent: '',
                time: '',
                english: '',
                content: 'All Classic Solo Content',
                contract: 'No',
                start: 'ASAP',
                socialmedia: 'Ready to create',
                tiktok: 'Yes',
                cblocked: 'CIS countries',
                ofverif: 'No',
                link: '',
                girlmsg: '',
                number: Date.now(),
            },
        ]);
    };

    

    const removeInfo = useCallback((number) => {
        setInfo(prevInfo => prevInfo.filter(i => i.number !== number));
    }, []);

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
            formData.append('isScoutModel', values.isScoutModel);

            if (values.isScoutModel && values.scoutId) {
                formData.append('scoutId', values.scoutId);
            }

            const brandIds = selectedBrands.map(b => b.id);
            formData.append('brandIds', JSON.stringify(brandIds));

            files.forEach(file => {
                formData.append('img', file);
            });

            await createThing(formData);
            message.success('Модель успешно добавлена!');
            onHide();
            form.resetFields();
            setFiles([]);
            setInfo([]);
            setSelectedBrands([]);
            setIsScoutModel(false);
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
                <Form.Item
                    name="isScoutModel"
                    label="Товар является скаутским?"
                    valuePropName="checked"
                >
                    <Checkbox onChange={(e) => setIsScoutModel(e.target.checked)} />
                </Form.Item>

                {isScoutModel && (
                    <Form.Item
                        name="scoutId"
                        label="Выберите скаута"
                        rules={[{ required: true, message: 'Пожалуйста, выберите скаута' }]}
                    >
                        <Select placeholder="Выберите скаута">
                            {scouts.map(scout => (
                                <Option value={scout.id} key={scout.id}>
                                    {scout.username} (Комиссия: {scout.percentage}%)
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}

                <Form.Item label="Изображения">
                    <ImageUploader images={files} setImages={setFiles} />
                </Form.Item>
                <Button type="dashed" onClick={addInfo} block style={{ marginBottom: '20px' }}>
                    Добавить информацию
                </Button>
                {info.map(i => (
                    <div key={i.number} style={{ marginBottom: '20px', border: '1px solid #f0f0f0', padding: '10px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Возраст">
                                    <Input
                                        value={i.age}
                                        onChange={e => changeInfo('age', e.target.value, i.number)}
                                        placeholder="Возраст"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Смартфон">
                                    <Input
                                        value={i.smartphone}
                                        onChange={e => changeInfo('smartphone', e.target.value, i.number)}
                                        placeholder="Смартфон"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Процент">
                                    <Input
                                        value={i.percent}
                                        onChange={e => changeInfo('percent', e.target.value, i.number)}
                                        placeholder="Процент"
                                        suffix="%"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Время">
                                    <Input
                                        value={i.time}
                                        onChange={e => changeInfo('time', e.target.value, i.number)}
                                        placeholder="Время"
                                        suffix="hours"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Английский">
                                    <Input
                                        value={i.english}
                                        onChange={e => changeInfo('english', e.target.value, i.number)}
                                        placeholder="Английский"
                                        suffix="/10"
                                    />
                                </Form.Item>
                            </Col><Col span={12}>
                                <Form.Item label="Контент">
                                    <Input
                                        value={i.content}
                                        onChange={e => changeInfo('content', e.target.value, i.number)}
                                        placeholder="Контент"
                                    />
                                </Form.Item>
                            </Col><Col span={12}>
                                <Form.Item label="Контракт">
                                    <Input
                                        value={i.contract}
                                        onChange={e => changeInfo('contract', e.target.value, i.number)}
                                        placeholder="Контракт"
                                    />
                                </Form.Item>
                            </Col><Col span={12}>
                                <Form.Item label="Когда начнет">
                                    <Input
                                        value={i.start}
                                        onChange={e => changeInfo('start', e.target.value, i.number)}
                                        placeholder="Старт"
                                    />
                                </Form.Item>
                            </Col><Col span={12}>
                                <Form.Item label="Соц. сети">
                                    <Input
                                        value={i.socialmedia}
                                        onChange={e => changeInfo('socialmedia', e.target.value, i.number)}
                                        placeholder="Соц. сети"
                                    />
                                </Form.Item>
                            </Col><Col span={12}>
                                <Form.Item label="ТикТок">
                                    <Input
                                        value={i.tiktok}
                                        onChange={e => changeInfo('tiktok', e.target.value, i.number)}
                                        placeholder="ТикТок"
                                    />
                                </Form.Item>
                            </Col><Col span={12}>
                                <Form.Item label="Блок. страны">
                                    <Input
                                        value={i.cblocked}
                                        onChange={e => changeInfo('cblocked', e.target.value, i.number)}
                                        placeholder="Блок. страны"
                                    />
                                </Form.Item>
                            </Col><Col span={12}>
                                <Form.Item label="OF верификация">
                                    <Input
                                        value={i.ofverif}
                                        onChange={e => changeInfo('ofverif', e.target.value, i.number)}
                                        placeholder="OF верификация"
                                    />
                                </Form.Item>
                            </Col><Col span={12}>
                                <Form.Item label="Контакт(ссылка)">
                                    <Input
                                        value={i.link}
                                        onChange={e => changeInfo('link', e.target.value, i.number)}
                                        placeholder="Контакт(ссылка)"
                                    />
                                </Form.Item>
                            </Col><Col span={12}>
                                <Form.Item label="Доступ к аккаунту?">
                                    <Input
                                        value={i.girlmsg}
                                        onChange={e => changeInfo('girlmsg', e.target.value, i.number)}
                                        placeholder="доступ"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Button
                                    type="danger"
                                    onClick={() => removeInfo(i.number)}
                                    block
                                >
                                    Удалить информацию
                                </Button>
                            </Col>
                        </Row>
                    </div>
                ))}
                <Form.Item>
                    <Button type="primary" onClick={addThing} block loading={loading}>
                        Добавить
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
});

export default CreateModel;



