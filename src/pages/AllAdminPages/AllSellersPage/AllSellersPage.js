import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../index';
import { observer } from 'mobx-react-lite';
import { Button, message, AutoComplete } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SELLER_INFO_ROUTE } from '../../../utils/consts';
import TopicBack from '../../../components/FuctionalComponents/TopicBack/TopicBack';
import styles from './AllSellersPage.module.css';
import StarRating from '../../../components/UI/StarRating/StarRating';
import LoadingIndicator from '../../../components/UI/LoadingIndicator/LoadingIndicator';

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
            message.error('Error loading sellers');
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
            message.error('Error loading seller info');
            console.error('Error loading seller:', error);
        }
    };

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

    const dataSource = selectedSeller ? [selectedSeller] : admin.sellers;

    return (
        <div className="container">
            <TopicBack title="All sellers" />
            <div className={styles.all_sellers}>
            <div className={styles.search_section}>
                <AutoComplete
                    value={searchText}
                    options={options}
                    onSelect={handleSelect}
                    onSearch={handleSearch}
                    onChange={handleSearch}
                    placeholder="Search by seller ID"
                    allowClear
                    style={{ width: '100%' }}
                />
            </div>
            {admin.isLoadingSellers ? (
                <LoadingIndicator />
            ) : (
                dataSource.map((seller) => (
                    <div key={seller.id} className={styles.seller}>
                        <div className={styles.seller_info}>
                            <div className={styles.seller_info_item}>
                            <div className={styles.seller_mail_id}>
                                {seller.email && (
                                    <h4>{seller.email}</h4> 
                                )}
                                {seller.username && (
                                    <h4>@{seller.username}</h4>
                                )}
                                {seller.telegramId && (
                                    <h4>Telegram ID: {seller.telegramId}</h4>
                                )}
                                <h4>ID: {seller.id}</h4>
                            </div>
                            <div className={styles.seller_rating}>
                                <span>{seller.sellerInformation?.sellerRating.toFixed(1) || 0}</span>
                                <StarRating rating={seller.sellerInformation?.sellerRating.toFixed(1) || 0} readonly />
                            </div>
                        </div>
                            <div className={styles.shop_info}>
                                <div className={styles.shop_info_item}>
                                    {seller.sellerInformation?.sellerName && (
                                        <span>Shop name: <strong>{seller.sellerInformation.sellerName}</strong></span>
                                    )}
                                    {seller.sellerInformation?.sellerInfo && (
                                        <span>Shop info: <strong>{seller.sellerInformation.sellerInfo}</strong></span>
                                    )}
                                </div>
                                <Button 
                                    type="primary"
                                    onClick={() => navigate(`${SELLER_INFO_ROUTE}/${seller.id}`)}
                                >
                                    Info
                                </Button>
                            </div>
                            
                        </div>
                    </div>
                ))
            )}
            </div>
        </div>
    );
});

export default AllSellersPage;
