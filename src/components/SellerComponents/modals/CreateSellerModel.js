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
                message.error('Error loading data: ' + error.message);
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
                return message.warning('Add at least one image!');
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
                        message.warning('Fill all fields!');
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
            message.success('Model successfully added!');
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
                message.error('Please fill all required fields!');
            } else {
                message.error('Error adding model: ' + (error.response?.data?.message || error.message));
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
            title="Add new model"
            width={800}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Country"
                    name="countryId"
                    rules={[{ required: true, message: 'Please choose country!' }]}
                >
                    <AutoComplete
                        options={countryOptions}
                        placeholder="Start typing country"
                        onSelect={(value, option) => handleCountrySelect(value, option)}
                        filterOption={(inputValue, option) =>
                            option.value.toLowerCase().includes(inputValue.toLowerCase())
                        }
                    />
                </Form.Item>

                <Form.Item
                    name="adultPlatformIds"
                    label="Choose platforms"
                    rules={[{ required: true, message: 'Please choose platforms' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Choose platforms"
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
                    label="Model name"
                    rules={[{ required: true, message: 'Please enter model name' }]}
                >
                    <Input placeholder="Enter model name" />
                </Form.Item>

                <Form.Item
                    name="priceUSD"
                    label="Model price (USD)"
                    rules={[{ required: true, message: 'Please enter model price' }]}
                >
                    <InputNumber
                        placeholder="Enter model price"
                        min={0}
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item label="Images" required>
                    <ImageUploader images={files} setImages={setFiles} />
                </Form.Item>

                <div style={{ marginBottom: '20px' }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Age" required>
                                <Input
                                    value={info[0].age}
                                    onChange={e => changeInfo('age', e.target.value, info[0].number)}
                                    placeholder="Age"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Smartphone" required>
                                <Input
                                    value={info[0].smartphone}
                                    onChange={e => changeInfo('smartphone', e.target.value, info[0].number)}
                                    placeholder="Smartphone"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Percent" required>
                                <Input
                                    value={info[0].percent}
                                    onChange={e => changeInfo('percent', e.target.value, info[0].number)}
                                    placeholder="Percent"
                                    suffix="%"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Time" required>
                                <Input
                                    value={info[0].time}
                                    onChange={e => changeInfo('time', e.target.value, info[0].number)}
                                    placeholder="Time"
                                    suffix="hours"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="English" required>
                                <Input
                                    value={info[0].english}
                                    onChange={e => changeInfo('english', e.target.value, info[0].number)}
                                    placeholder="English"
                                    suffix="/10"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Content" required>
                                <Input
                                    value={info[0].content}
                                    onChange={e => changeInfo('content', e.target.value, info[0].number)}
                                    placeholder="Content"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Contract" required>
                                <Input
                                    value={info[0].contract}
                                    onChange={e => changeInfo('contract', e.target.value, info[0].number)}
                                    placeholder="Contract"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="When starts" required>
                                <Input
                                    value={info[0].start}
                                    onChange={e => changeInfo('start', e.target.value, info[0].number)}
                                    placeholder="When starts"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Social media" required>
                                <Input
                                    value={info[0].socialmedia}
                                    onChange={e => changeInfo('socialmedia', e.target.value, info[0].number)}
                                    placeholder="Social media"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="TikTok" required>
                                <Input
                                    value={info[0].tiktok}
                                    onChange={e => changeInfo('tiktok', e.target.value, info[0].number)}
                                    placeholder="TikTok"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Blocked countries" required>
                                <Input
                                    value={info[0].cblocked}
                                    onChange={e => changeInfo('cblocked', e.target.value, info[0].number)}
                                    placeholder="Blocked countries"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="OF verification" required>
                                <Input
                                    value={info[0].ofverif}
                                    onChange={e => changeInfo('ofverif', e.target.value, info[0].number)}
                                    placeholder="OF verification"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Contact (link)" required>
                                <Input
                                    value={info[0].link}
                                    onChange={e => changeInfo('link', e.target.value, info[0].number)}
                                    placeholder="Contact (link)"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Access to account?" required>
                                <Input
                                    value={info[0].girlmsg}
                                    onChange={e => changeInfo('girlmsg', e.target.value, info[0].number)}
                                    placeholder="Access to account?"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                <Form.Item>
                    <Button type="primary" onClick={addModel} block loading={loading}>
                        Add Model
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );

});

export default CreateSellerModel;
