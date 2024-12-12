import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../../../index';
import ModelInfoCard from './ModelInfoCard';
import styles from './SellerInfoComponents.module.css';
import LoadingIndicator from '../../UI/LoadingIndicator/LoadingIndicator';

const SellerModelsInfo = observer(({ sellerId }) => {
    const { seller } = useContext(Context);

    useEffect(() => {
        seller.loadSellerModelProducts(sellerId);
    }, [sellerId]);

    if (seller.loading) {
        return <LoadingIndicator />;
    }

    return (
        <div className={styles.models}>
            <h3>Seller Models</h3>
            <div className={styles.models_list}>
                {seller.sellerModelProducts.length > 0 ? (
                    seller.sellerModelProducts.map((model) => (
                        <ModelInfoCard key={model.id} thing={model} />
                    ))
                ) : (
                    <span className={styles.placeholder}>No models found for this seller.</span>
                )}
            </div>
        </div>
    );
});

export default SellerModelsInfo;
