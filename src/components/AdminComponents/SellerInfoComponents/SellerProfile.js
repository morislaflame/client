import React, { useLayoutEffect } from 'react';
import styles from '../AdminComponents.module.css';
import StarRating from '../../UI/StarRating/StarRating';
import { DownAnimation } from '../../Animations/DownAnimation';

const SellerProfile = ({ sellerInfo }) => {

    useLayoutEffect(() => {
        DownAnimation('#seller-info');
    }, []);

    return (
        <div className={styles.seller_info} id='seller-info'>
            <div className={styles.seller_info_item}>
                <div className={styles.seller_mail_id}>
                    {sellerInfo.email && (
                        <h4>{sellerInfo.email}</h4> 
                    )}
                    {sellerInfo.username && (
                        <h4>@{sellerInfo.username}</h4>
                    )}
                    {sellerInfo.telegramId && (
                        <h4>Telegram ID: {sellerInfo.telegramId}</h4>
                    )}
                    <h4>ID: {sellerInfo.id}</h4>
                </div>
                <div className={styles.seller_rating}>
                    <span>{sellerInfo.sellerInformation?.sellerRating.toFixed(1) || 0}</span>
                    <StarRating rating={sellerInfo.sellerInformation?.sellerRating.toFixed(1) || 0} readonly />
                </div>
            </div>
            
            <div className={styles.seller_i}>
                {sellerInfo.sellerInformation?.sellerName && (
                    <span>Shop name: <strong>{sellerInfo.sellerInformation.sellerName}</strong></span>
                )}
                
                {sellerInfo.sellerInformation?.sellerInfo && (
                    <span>Shop info: <strong>{sellerInfo.sellerInformation.sellerInfo}</strong></span>
                )}
            </div>
        </div>
    );
};

export default SellerProfile;