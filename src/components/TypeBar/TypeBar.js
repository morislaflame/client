import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../../index";
import './TypeBar.css';

const TypeBar = observer(() => {
    const {thing} = useContext(Context);

    const handleTypeClick = (type) => {
        if (thing.selectedType.id === type.id) {
            // Если тип уже выбран, сбрасываем выбор
            thing.setSelectedType({});
        } else {
            // Иначе выбираем новый тип
            thing.setSelectedType(type);
        }
    };

    return (
        <li className={'main_li'}>
            {thing.types.map(type =>
                <div
                    className={`type_name ${type.id === thing.selectedType.id ? 'selected' : ''}`}
                    onClick={() => handleTypeClick(type)}
                    key={type.id}
                >
                    {type.name}
                </div>
            )}
        </li>
    );
});

export default TypeBar;
