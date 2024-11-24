import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Context } from "../../../../index";
import { AutoComplete } from 'antd';
import './TypeBar.css';

const TypeBar = observer(() => {
    const { model } = useContext(Context);
    const [searchTerm, setSearchTerm] = useState("");

    const options = model.countries.map(country => ({
        value: country.name,
        label: country.name
    }));

    const handleSelect = (value) => {
        const selectedCountry = model.countries.find(country => country.name === value);
        if (selectedCountry) {
            model.setSelectedCountry(selectedCountry);
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
