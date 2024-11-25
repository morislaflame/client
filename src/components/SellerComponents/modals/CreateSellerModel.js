import React, { useContext, useState, useEffect, useCallback } from "react";
import { Button, Modal, Form, Input, InputNumber, Select, Row, Col, message, AutoComplete } from 'antd';
import { observer } from "mobx-react-lite";
import { Context } from "../../../index";
import ImageUploader from '../../UI/ImageUploader/ImageUploader';

const { Option } = Select;

const CreateSellerModel = observer(({ show, onHide }) => {
    const { seller, model } = useContext(Context); // Используем ModelStore и SellerStore из контекста
    const [form] = Form.useForm();
    const [files, setFiles] = useState([]);
    const [info, setInfo] = useState([{
        age: '20',
        smartphone: 'Iphone',
        percent: '30',
        time: '10',
        english: '5',
        content: 'All classic solo content',
        contract: 'No',
        start: 'ASAP',
        socialmedia: 'Need new accounts',
        tiktok: 'Yes',
        cblocked: 'No',
        ofverif: 'Yes',
        link: 'https://www.instagram.com/example',
        girlmsg: 'Yes',
        number: Date.now(),
    }]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Используем методы ModelStore для загрузки данных
                await model.loadCountries(); // Предполагается, что такой метод существует
                await model.loadAdultPlatforms(); // Предполагается, что такой метод существует
            } catch (error) {
                message.error('Ошибка при загрузке данных: ' + error.message);
            }
        };
        loadData();
    }, [model]);

    const changeInfo = useCallback((key, value, number) => {
        setInfo(prevInfo =>
            prevInfo.map(i => (i.number === number ? { ...i, [key]: value } : i))
        );
    }, []);

    const handleAdultPlatformChange = (value) => {
        // Устанавливаем выбранные платформы в ModelStore
        const selected = model.adultPlatforms.filter(platform => value.includes(platform.id));
        model.setSelectedAdultPlatforms(selected);
    };

    const handleCountrySelect = (value, option) => {
        form.setFieldsValue({ countryId: option.id });
    };

    const addModel = async () => {
        setLoading(true);
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
            formData.append('priceUSD', values.priceUSD); // Убедитесь, что поле названо правильно
            formData.append('countryId', values.countryId);
            formData.append('info', JSON.stringify(info[0])); // Если info — массив с одним объектом

            const adultPlatformIds = model.selectedAdultPlatforms.map(b => b.id);
            formData.append('adultPlatformIds', JSON.stringify(adultPlatformIds));

            files.forEach(file => {
                formData.append('img', file.originFileObj || file); // Убедитесь, что добавляются файлы корректно
            });

            // Используем метод из SellerStore для создания модели
            await seller.createModelProduct(formData);
            message.success('Модель успешно добавлена!');
            onHide();
            form.resetFields();
            setFiles([]);
            setInfo([{
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
            model.setSelectedAdultPlatforms([]);
        } catch (error) {
            if (error.errorFields) {
                message.error('Пожалуйста, заполните все обязательные поля!');
            } else {
                message.error('Ошибка при добавлении модели: ' + (error.response?.data?.message || error.message));
            }
        } finally {
            setLoading(false);
        }
    };

    // Формируем опции для стран
    const countryOptions = model.countries.map(country => ({
        value: country.name,
        id: country.id,
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
                    name="countryId"
                    rules={[{ required: true, message: 'Пожалуйста, выберите страну!' }]}
                >
                    <AutoComplete
                        options={countryOptions}
                        placeholder="Начните вводить страну"
                        onSelect={(value, option) => handleCountrySelect(value, option)}
                        filterOption={(inputValue, option) =>
                            option.value.toLowerCase().includes(inputValue.toLowerCase())
                        }
                    />
                </Form.Item>

                <Form.Item
                    name="adultPlatformIds"
                    label="Выберите платформы"
                    rules={[{ required: true, message: 'Пожалуйста, выберите платформы' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Выберите платформы"
                        onChange={handleAdultPlatformChange}
                    >
                        {model.adultPlatforms.map(adultPlatform => (
                            <Option value={adultPlatform.id} key={adultPlatform.id}>
                                {adultPlatform.name}
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
                    name="priceUSD"
                    label="Цена модели (USD)"
                    rules={[{ required: true, message: 'Пожалуйста, введите цену модели!' }]}
                >
                    <InputNumber
                        placeholder="Введите цену модели"
                        min={0}
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item label="Изображения" required>
                    <ImageUploader images={files} setImages={setFiles} />
                </Form.Item>

                <div style={{ marginBottom: '20px' }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Возраст" required>
                                <Input
                                    value={info[0].age}
                                    onChange={e => changeInfo('age', e.target.value, info[0].number)}
                                    placeholder="Возраст"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Смартфон" required>
                                <Input
                                    value={info[0].smartphone}
                                    onChange={e => changeInfo('smartphone', e.target.value, info[0].number)}
                                    placeholder="Смартфон"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Процент" required>
                                <Input
                                    value={info[0].percent}
                                    onChange={e => changeInfo('percent', e.target.value, info[0].number)}
                                    placeholder="Процент"
                                    suffix="%"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Время" required>
                                <Input
                                    value={info[0].time}
                                    onChange={e => changeInfo('time', e.target.value, info[0].number)}
                                    placeholder="Время"
                                    suffix="hours"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Английский" required>
                                <Input
                                    value={info[0].english}
                                    onChange={e => changeInfo('english', e.target.value, info[0].number)}
                                    placeholder="Английский"
                                    suffix="/10"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Контент" required>
                                <Input
                                    value={info[0].content}
                                    onChange={e => changeInfo('content', e.target.value, info[0].number)}
                                    placeholder="Контент"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Контракт" required>
                                <Input
                                    value={info[0].contract}
                                    onChange={e => changeInfo('contract', e.target.value, info[0].number)}
                                    placeholder="Контракт"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Когда начнет" required>
                                <Input
                                    value={info[0].start}
                                    onChange={e => changeInfo('start', e.target.value, info[0].number)}
                                    placeholder="Старт"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Соц. сети" required>
                                <Input
                                    value={info[0].socialmedia}
                                    onChange={e => changeInfo('socialmedia', e.target.value, info[0].number)}
                                    placeholder="Соц. сети"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="ТикТок" required>
                                <Input
                                    value={info[0].tiktok}
                                    onChange={e => changeInfo('tiktok', e.target.value, info[0].number)}
                                    placeholder="ТикТок"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Блок. страны" required>
                                <Input
                                    value={info[0].cblocked}
                                    onChange={e => changeInfo('cblocked', e.target.value, info[0].number)}
                                    placeholder="Блок. страны"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="OF верификация" required>
                                <Input
                                    value={info[0].ofverif}
                                    onChange={e => changeInfo('ofverif', e.target.value, info[0].number)}
                                    placeholder="OF верификация"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Контакт (ссылка)" required>
                                <Input
                                    value={info[0].link}
                                    onChange={e => changeInfo('link', e.target.value, info[0].number)}
                                    placeholder="Контакт (ссылка)"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Доступ к аккаунту?" required>
                                <Input
                                    value={info[0].girlmsg}
                                    onChange={e => changeInfo('girlmsg', e.target.value, info[0].number)}
                                    placeholder="Доступ"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                <Form.Item>
                    <Button type="primary" onClick={addModel} block loading={loading}>
                        Добавить
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );

});

export default CreateSellerModel;
