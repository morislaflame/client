import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useContext, useLayoutEffect } from 'react';
import { Context } from '../../../index';
import Search from '../../FuctionalComponents/Search/Search';
import ModelItem from '../../ShopComponents/ModelItem/ModelItem';
import ModelsSkeletonsArray from '../../UI/Skeletons/ModelsSkeletonsArray';
import { UpAnimation } from '../../Animations/UpAnimation';
import { DownAnimation } from '../../Animations/DownAnimation';

const SellerModelsInfo = observer(({ sellerId }) => {
    const { seller } = useContext(Context);
    const [filteredModels, setFilteredModels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadModels = async () => {
            setLoading(true);
            try {
                await seller.loadSellerModelProducts(sellerId);
            } catch (error) {
                console.error('Error loading seller models:', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadModels();
    }, [sellerId]);

    useLayoutEffect(() => {
        DownAnimation('#seller-models-title');
        UpAnimation('.thing-list');
    }, []);

    const formatModelOption = (model) => ({
        value: model.id.toString(),
        label: (
            <div className="search_options">
                <span className="search_options_label">{model.name} (ID: {model.id})</span>
                <span className="search_options_label">Price: ${model.priceUSD}</span>
            </div>
        )
    });

    return (
        <div className="container-item">
            <h3 id='seller-models-title'>Seller Models</h3>
            <Search 
                data={seller.sellerModelProducts}
                setFilteredData={setFilteredModels}
                searchFields={['id', 'name', 'priceUSD']}
                placeholder="Search by model name or ID"
                formatOption={formatModelOption}
            />
            <div className="thing-list">
                {loading ? (
                    <ModelsSkeletonsArray count={20} />
                ) : (
                    filteredModels.length > 0 ? (
                        filteredModels.map((model) => (
                            <ModelItem key={model.id} model={model} />
                        ))
                    ) : (
                        <span className="no-info-container">No models found for this seller.</span>
                    )
                )}
            </div>
        </div>
    );
});

export default SellerModelsInfo;
