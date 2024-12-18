import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Context } from "../../../../index";
import { AutoComplete } from 'antd';

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
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }
    };

    return (
        <div className="container-card">
            <div className="container-item">
                <h3 style={{ margin: '0' }}>Country</h3>
                <AutoComplete
                    style={{ width: '100%' }}
                    options={options}
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onSelect={handleSelect}
                    placeholder="Country"
                    allowClear
                    onClear={() => {
                        model.setSelectedCountry({});
                        if (window.Telegram?.WebApp?.HapticFeedback) {
                            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
                        }
                    }}
                />
            </div>
        </div>
    );
});

export default TypeBar;
