import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Context } from "../../index";
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import './TypeBar.css';

const TypeBar = observer(() => {
    const { thing } = useContext(Context);
    const [searchTerm, setSearchTerm] = useState("");

    // Показываем первые три типа
    const firstThreeTypes = thing.types.slice(0, 3);

    // Фильтруем типы по поисковому запросу, но показываем их только если есть ввод
    const filteredTypes = thing.types.filter(type =>
        type.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5); // Показываем не более 5 результатов

    const handleTypeClick = (type) => {
        if (thing.selectedType.id === type.id) {
            thing.setSelectedType({});
        } else {
            thing.setSelectedType(type);
        }
    };

    return (
        <div className="typebar">
            <ListGroup>
                {firstThreeTypes.map(type => (
                    <ListGroup.Item
                        className={`type_name ${type.id === thing.selectedType.id ? 'selected' : ''}`}
                        onClick={() => handleTypeClick(type)}
                        key={type.id}
                        action
                    >
                        {type.name}
                    </ListGroup.Item>
                ))}
            </ListGroup>

            {/* Поисковая строка для динамической фильтрации типов */}
            <Form.Group className="mt-3">
                <Form.Control
                    type="text"
                    placeholder="Search by country"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Form.Group>

            {/* Показываем типы только если есть ввод */}
            {searchTerm && (
                <ListGroup className="mt-2">
                    {filteredTypes.map(type => (
                        <ListGroup.Item
                            className={`type_name ${type.id === thing.selectedType.id ? 'selected' : ''}`}
                            onClick={() => handleTypeClick(type)}
                            key={type.id}
                            action
                        >
                            {type.name}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
});

export default TypeBar;
