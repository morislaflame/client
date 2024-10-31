import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Context } from "../../index";
import { AutoComplete } from 'antd';
import './TypeBar.css';

const TypeBar = observer(() => {
    const { thing } = useContext(Context);
    const [searchTerm, setSearchTerm] = useState("");

    const options = thing.types.map(type => ({
        value: type.name,
        label: type.name
    }));

    const handleSelect = (value) => {
        const selectedType = thing.types.find(type => type.name === value);
        if (selectedType) {
            thing.setSelectedType(selectedType);
        }
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
    };

    return (
        <div className="typebar">
            <AutoComplete
                style={{ width: '100%' }}
                options={options}
                value={searchTerm}
                onChange={setSearchTerm}
                onSelect={handleSelect}
                placeholder="Country"
            />
            {/* {thing.selectedType.id && (
                <div className="selected-type">
                    <span className="type_name">{thing.selectedType.name}</span>
                </div>
            )} */}
        </div>
    );
});

export default TypeBar;
