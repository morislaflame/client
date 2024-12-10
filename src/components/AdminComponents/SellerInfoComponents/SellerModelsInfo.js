import React from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../../../index';
import ModelInfoCard from './ModelInfoCard';
import styles from './SellerInfoComponents.module.css';

const SellerModelsInfo = observer(({ sellerId }) => {
    const { seller } = useContext(Context);
    const sellerModels = seller.sellerInfo?.sellingProducts || [];

    return (
        <div className={styles.models}>
            <h3>Seller Models</h3>
            <div className={styles.models_list}>
                {sellerModels.length > 0 ? (
                    sellerModels.map((model) => (
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
