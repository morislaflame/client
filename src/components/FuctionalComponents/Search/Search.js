import React, { useState, useEffect, useLayoutEffect } from 'react';
import { AutoComplete, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './Search.module.css';
import { DownAnimation } from '../../Animations/DownAnimation';

const Search = ({ 
    data,
    onSelect,
    setFilteredData,
    searchFields = ['id'],
    placeholder = "Search...",
    formatOption = (item) => ({
        value: item.id.toString(),
        label: item.id.toString()
    })
}) => {
    const [searchValue, setSearchValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    useLayoutEffect(() => {
        DownAnimation('#search');
    }, []);

    const handleSearch = (value) => {
        setSearchValue(value);
        if (value) {
            const filtered = data.filter(item => {
                return searchFields.some(field => {
                    const fieldValue = field.split('.').reduce((obj, key) => obj?.[key], item);
                    if (fieldValue === undefined || fieldValue === null) return false;
                    
                    return String(fieldValue)
                        .toLowerCase()
                        .includes(value.toLowerCase());
                });
            });
            setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
    };

    const options = data.map(formatOption);

    return (
        <div className={styles.search_section} id='search'>
            <AutoComplete
                value={searchValue}
                options={options}
                onChange={handleSearch}
                onSelect={onSelect}
                placeholder={placeholder}
                allowClear
                style={{ width: '100%' }}
                notFoundContent={isSearching ? <Spin indicator={<LoadingOutlined spin />} /> : null}
            />
        </div>
    );
};

export default Search;
