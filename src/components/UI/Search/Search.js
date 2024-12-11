import React, { useState, useEffect } from 'react';
import { AutoComplete, Button, Spin, Space, Typography } from 'antd';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import styles from './Search.module.css';

const { Text } = Typography;

const Search = ({ 
    data,
    onSelect,
    placeholder,
    buttonText = "Search",
    formatOption = (item) => ({
        value: item.id.toString(),
        label: item.id.toString()
    })
}) => {
    const [searchValue, setSearchValue] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (searchValue) {
            const filtered = data
                .filter(item => item.id.toString().includes(searchValue))
                .slice(0, 5);
            setFilteredItems(filtered);
        } else {
            setFilteredItems([]);
        }
    }, [searchValue, data]);

    const handleSearch = (value) => {
        if (!value) return;
        setIsSearching(true);
        try {
            const foundItem = data.find(item => item.id.toString() === value);
            if (foundItem) {
                onSelect(value);
            }
        } catch (error) {
            console.error('Error finding item:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const options = filteredItems.map(formatOption);

    return (
        <div className={styles.search_section}>
            <AutoComplete
                style={{ width: '100%' }}
                options={options}
                value={searchValue}
                onChange={setSearchValue}
                onSelect={handleSearch}
                placeholder={placeholder}
                notFoundContent={isSearching ? <Spin indicator={<LoadingOutlined spin />} /> : null}
                filterOption={(inputValue, option) =>
                    option.value.toLowerCase().includes(inputValue.toLowerCase())
                }
            />
            <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => handleSearch(searchValue)}
                loading={isSearching}
                block
            >
                {buttonText}
            </Button>
        </div>
    );
};

export default Search;
