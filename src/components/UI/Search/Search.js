import React, { useState, useEffect } from 'react';
import { AutoComplete, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './Search.module.css';

const Search = ({ 
    data,
    onSelect,
    onSearch,
    placeholder,
    formatOption = (item) => ({
        value: item.id.toString(),
        label: item.id.toString()
    }),
    onFilter = (searchValue, item) => 
        item.id.toString().includes(searchValue)
}) => {
    const [searchValue, setSearchValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [filteredData, setFilteredData] = useState(data);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const handleSearch = (value) => {
        setSearchValue(value);
        if (value) {
            const filtered = data.filter(item => onFilter(value, item));
            setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
        onSearch?.(value, filteredData);
    };

    const options = data.map(formatOption);

    return (
        <div className={styles.search_section}>
            <AutoComplete
                value={searchValue}
                options={options}
                onChange={handleSearch}
                placeholder={placeholder}
                allowClear
                style={{ width: '100%' }}
                notFoundContent={isSearching ? <Spin indicator={<LoadingOutlined spin />} /> : null}
            />
        </div>
    );
};

export default Search;
