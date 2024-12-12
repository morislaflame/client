import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../../../index';
import ModelInfoCard from './ModelInfoCard';
import styles from './SellerInfoComponents.module.css';
import LoadingIndicator from '../../UI/LoadingIndicator/LoadingIndicator';
import Search from '../../UI/Search/Search';

const SellerModelsInfo = observer(({ sellerId }) => {
    const { seller } = useContext(Context);
    const [filteredModels, setFilteredModels] = useState([]);

    useEffect(() => {
        seller.loadSellerModelProducts(sellerId);
    }, [sellerId]);

    const formatModelOption = (model) => ({
        value: model.id.toString(),
        label: (
            <div className="search_options">
                <span className="search_options_label">{model.name} (ID: {model.id})</span>
                <span className="search_options_label">Price: ${model.priceUSD}</span>
            </div>
        )
    });

    if (seller.loading) {
        return <LoadingIndicator />;
    }

    return (
        <div className="container-item">
            <h3>Seller Models</h3>
            <Search 
                data={seller.sellerModelProducts}
                setFilteredData={setFilteredModels}
                searchFields={['id', 'name', 'priceUSD']}
                placeholder="Search by model name or ID"
                formatOption={formatModelOption}
                
            />
            <div className={styles.models_list}>
                {filteredModels.length > 0 ? (
                    filteredModels.map((model) => (
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
