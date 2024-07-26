import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../../index";
import './TypeBar.css';

const TypeBar = observer(() => {
    const {thing} = useContext(Context)
    return (
        <li className={'main_li'}>
            {thing.types.map(type =>
                <div
                    className={`type_name ${type.id === thing.selectedType.id ? 'selected' : ''}`}
                    // active={type.id === thing.selectedType.id}
                    onClick={() => thing.setSelectedType(type)}
                    key={type.id}
                >
                    {type.name}
                </div>
            )}
        </li>
    );
});

export default TypeBar;