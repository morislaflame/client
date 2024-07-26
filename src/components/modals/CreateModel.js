import React, { useContext, useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from "react-bootstrap/esm/Dropdown";
import { Context } from "../../index";
import { createThing, fetchBrands, fetchThings, fetchTypes } from '../../http/thingAPI';
import { observer } from "mobx-react-lite";

const CreateModel = observer(({show, onHide}) => {
    const{thing} = useContext(Context)
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [file, setFile] = useState(null)
    const [info, setInfo] = useState([])

    useEffect(() => {
        fetchTypes().then(data => thing.setTypes(data))
        fetchBrands().then(data => thing.setBrands(data))
      }, [])

    const addInfo = () => {
        setInfo([...info, {title: '', description: '', number: Date.now()}])
    }

    const removeInfo = (number) => {
        setInfo(info.filter(i => i.number !== number))
    }

    const changeInfo = (key, value, number) => {
        setInfo(info.map(i => i.number === number ? {...i, [key]: value} : i))
    }

    const selectFile = e => {
        setFile(e.target.files[0])
    }

    const addThing = () => {
        const formData = new FormData()
        formData.append('name', name)
        formData.append('price', `${price}`)
        formData.append('img', file)
        formData.append('brandId', thing.selectedBrand.id)
        formData.append('typeId', thing.selectedType.id)
        formData.append('info', JSON.stringify(info))
        createThing(formData).then(data => onHide())
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
                    <Dropdown.Toggle>{thing.selectedType.name || "Выберите тип"}</Dropdown.Toggle>
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
                    <Dropdown.Toggle>{thing.selectedBrand.name || "Выберите бренд"}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {thing.brands.map(brand => 
                            <Dropdown.Item 
                                onClick={() => thing.setSelectedBrand(brand)} 
                                key={brand.id}>
                                {brand.name}
                            </Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                <Form.Control
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="mt-3"
                    placeholder="Введите имя чепки"
                />
                <Form.Control
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="mt-3"
                    placeholder="Введите цену чепки"
                    type="number"
                />
                <Form.Control
                    className="mt-3"
                    type="file"
                    onChange={selectFile}
                />
                <hr/>
                <Button variant="outline-dark" onClick={addInfo}>Добавить Замечание</Button>
                {info.map(i => 
                    <Row className="mt-3" key={i.number}>
                        <Col md={4}>
                            <Form.Control
                                value={i.title}
                                onChange={(e) => changeInfo('title', e.target.value, i.number)}
                                placeholder='Введите название замечания'
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Control
                                value={i.description}
                                onChange={(e) => changeInfo('description', e.target.value, i.number)}
                                placeholder='Введите замечание'
                            />
                        </Col>
                        <Col md={4}>
                            <Button onClick={() => removeInfo(i.number)} variant="outline-danger">Удалить</Button>
                        </Col>
                    </Row>
                )}
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