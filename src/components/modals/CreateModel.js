import React, { useContext, useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from "react-bootstrap/esm/Dropdown";
import { Context } from "../../index";
import { createThing, fetchBrands, fetchTypes } from '../../http/thingAPI';
import { observer } from "mobx-react-lite";
import { message } from "antd";
import ImageUploader from "../ImageUploader/ImageUploader";

const CreateModel = observer(({show, onHide}) => {
    const {thing} = useContext(Context);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [files, setFiles] = useState([]);
    const [info, setInfo] = useState([]); // Инициализация как массива
    const [selectedBrands, setSelectedBrands] = useState([]);

    useEffect(() => {
        fetchTypes().then(data => thing.setTypes(data));
        fetchBrands().then(data => thing.setBrands(data));
    }, [thing]);

    const addInfo = () => {
        setInfo(prevInfo => [...prevInfo, {
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
            number: Date.now()
        }]);
    }

    const removeInfo = (number) => {
        setInfo(prevInfo => prevInfo.filter(i => i.number !== number));
    }

    const changeInfo = (key, value, number) => {
        setInfo(prevInfo => prevInfo.map(i => i.number === number ? {...i, [key]: value} : i));
    }

    const toggleBrandSelection = (brand) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(prevBrands => prevBrands.filter(b => b.id !== brand.id));
        } else {
            setSelectedBrands(prevBrands => [...prevBrands, brand]);
        }
    }

    const addThing = () => {
        if (!name.trim()) {
            return message.warning("Введите имя товара!");
        }
    
        // Проверка цены
        if (!price || price <= 0) {
            return message.warning("Введите корректную цену товара!");
        }
    
        // Проверка, выбран ли тип
        if (!thing.selectedType.id) {
            return message.warning("Выберите тип товара!");
        }
    
        // Проверка, выбраны ли бренды
        if (selectedBrands.length === 0) {
            return message.warning("Выберите хотя бы один бренд!");
        }
    
        // Проверка, загружены ли изображения
        if (files.length === 0) {
            return message.warning("Добавьте хотя бы одно изображение!");
        }
    
        const requiredFields = ['age', 'smartphone', 'percent', 'time', 'english', 'content', 'contract', 'start', 'socialmedia', 'tiktok', 'cblocked', 'ofverif', 'link', 'girlmsg'];

        for (let i of info) {
            for (let field of requiredFields) {
                if (!i[field]?.trim()) {
                    message.warning("Заполните все поля информации!");
                    return;
                }
            }
        }


        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', `${price}`);
        formData.append('typeId', thing.selectedType.id);
        formData.append('info', JSON.stringify(info));

        const brandIds = selectedBrands.map(b => b.id);
        formData.append('brandIds', JSON.stringify(brandIds));

        files.forEach(file => {
            formData.append('img', file);
        });

        createThing(formData).then(data => onHide());
        message.success("Модель добавлена!");
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
            Добавить новую модель
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Dropdown className="mt-1 mb-2">
                    <Dropdown.Toggle>{thing.selectedType.name || "Выберите страну"}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {thing.types.map(type => 
                            <Dropdown.Item 
                                onClick={() => thing.setSelectedType(type)} 
                                key={type.id}>
                                {type.name}
                            </Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown className="mt-3 mb-2">
                    <Dropdown.Toggle>{selectedBrands.length > 0 ? selectedBrands.map(b => b.name).join(", ") : "Выберите бренды"}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {thing.brands.map(brand => 
                            <Dropdown.Item 
                                onClick={() => toggleBrandSelection(brand)} 
                                key={brand.id}>
                                {brand.name} {selectedBrands.includes(brand) ? "(выбрано)" : ""}
                            </Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                <Form.Control
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="mt-3"
                    placeholder="Введите имя товара"
                />
                <Form.Control
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="mt-3"
                    placeholder="Введите цену товара"
                    type="number"
                />

                <ImageUploader images={files} setImages={setFiles} />

                <Button variant="outline-dark" onClick={addInfo} className="mt-3">Добавить информацию</Button>
                <hr/>
                {info.map(i => (
                    <Row key={i.number} className="mt-3">
                        <Col md={6}>
                            <Form.Control
                                value={i.age}
                                onChange={e => changeInfo('age', e.target.value, i.number)}
                                placeholder='Возраст'
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Control
                                value={i.smartphone}
                                onChange={e => changeInfo('smartphone', e.target.value, i.number)}
                                placeholder='Смартфон'
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Control
                                value={i.percent}
                                onChange={e => changeInfo('percent', e.target.value, i.number)}
                                placeholder='Процент'
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Control
                                value={i.time}
                                onChange={e => changeInfo('time', e.target.value, i.number)}
                                placeholder='Время'
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Control
                                value={i.english}
                                onChange={e => changeInfo('english', e.target.value, i.number)}
                                placeholder='Уровень английского'
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Control
                                value={i.content}
                                onChange={e => changeInfo('content', e.target.value, i.number)}
                                placeholder='Контент'
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Control
                                value={i.contract}
                                onChange={e => changeInfo('contract', e.target.value, i.number)}
                                placeholder='Контракт'
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Control
                                value={i.start}
                                onChange={e => changeInfo('start', e.target.value, i.number)}
                                placeholder='Дата начала'
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Control
                                value={i.socialmedia}
                                onChange={e => changeInfo('socialmedia', e.target.value, i.number)}
                                placeholder='Социальные сети'
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Control
                                value={i.tiktok}
                                onChange={e => changeInfo('tiktok', e.target.value, i.number)}
                                placeholder='TikTok'
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Control
                                value={i.cblocked}
                                onChange={e => changeInfo('cblocked', e.target.value, i.number)}
                                placeholder='CBlocked'
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Control
                                value={i.ofverif}
                                onChange={e => changeInfo('ofverif', e.target.value, i.number)}
                                placeholder='OF Verification'
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Control
                                value={i.link}
                                onChange={e => changeInfo('link', e.target.value, i.number)}
                                placeholder='TG Link'
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Control
                                value={i.girlmsg}
                                onChange={e => changeInfo('girlmsg', e.target.value, i.number)}
                                placeholder='MSG From Girl'
                            />
                        </Col>
                        
                        <Col md={12}>
                            <Button variant="outline-danger" onClick={() => removeInfo(i.number)} className="mt-2">Удалить информацию</Button>
                        </Col>
                    </Row>
                ))}
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
            <Button variant="outline-success" onClick={addThing}>Добавить</Button>
        </Modal.Footer>
        </Modal>
    );
});

export default CreateModel;
