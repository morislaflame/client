import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../index';
import { observer } from 'mobx-react-lite';
import { Table, Card, Space, Button, message, Modal, AutoComplete } from 'antd';
import { UserOutlined, ShopOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { SELLER_INFO_ROUTE } from '../../../utils/consts';

const AllSellersPage = observer(() => {
    const { admin } = useContext(Context);
    const [searchText, setSearchText] = useState('');
    const [selectedSeller, setSelectedSeller] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadSellers();
    }, []);

    const loadSellers = async () => {
        try {
            await admin.loadSellers();
        } catch (error) {
            message.error('Ошибка при загрузке продавцов');
            console.error('Error loading sellers:', error);
        }
    };

    

    const handleSearch = (value) => {
        setSearchText(value);
        setSelectedSeller(null);
    };

    const handleSelect = async (value) => {
        try {
            const seller = await admin.getSellerById(value);
            setSelectedSeller(seller);
        } catch (error) {
            message.error('Ошибка при загрузке информации о продавце');
            console.error('Error loading seller:', error);
        }
    };

    // Формируем опции для AutoComplete
    const options = admin.sellers.map(seller => ({
        value: seller.id.toString(),
        label: (
            <div>
                ID: {seller.id}
                {seller.sellerInformation?.sellerName && 
                    ` - ${seller.sellerInformation.sellerName}`
                }
            </div>
        ),
    }));

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Информация о продавце',
            dataIndex: 'sellerInfo',
            key: 'sellerInfo',
            render: (_, record) => (
                <Space direction="vertical">
                    {record.email && <span><UserOutlined /> Email: {record.email}</span>}
                    {record.username && <span><UserOutlined /> Username: {record.username}</span>}
                    {record.telegramId && <span><UserOutlined /> Telegram ID: {record.telegramId}</span>}
                    {record.sellerInformation?.sellerName && (
                        <span><ShopOutlined /> Название магазина: {record.sellerInformation.sellerName}</span>
                    )}
                    {record.sellerInformation?.sellerRating && (
                        <span><StarOutlined /> Рейтинг: {record.sellerInformation.sellerRating}</span>
                    )}
                </Space>
            ),
        },
        {
            title: 'Действия',
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <Button 
                    type="primary"
                    onClick={() => navigate(`${SELLER_INFO_ROUTE}/${record.id}`)}
                >
                    Info
                </Button>
            ),
        },
    ];

    const dataSource = selectedSeller ? [selectedSeller] : admin.sellers;

    return (
        <Card title="Управление продавцами" style={{ margin: 20 }}>
            <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
                <AutoComplete
                    value={searchText}
                    options={options}
                    onSelect={handleSelect}
                    onSearch={handleSearch}
                    onChange={handleSearch}
                    placeholder="Поиск по ID продавца"
                    allowClear
                />
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="id"
                    loading={admin.isLoadingSellers}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Всего ${total} продавцов`,
                    }}
                />
            </Space>
        </Card>
    );
});

export default AllSellersPage;
