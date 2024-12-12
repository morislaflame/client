import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../../../index';
import Search from '../../UI/Search/Search';
import ModelItem from '../../ShopComponents/ModelItem/ModelItem';
import ModelsSkeletonsArray from '../../UI/Skeletons/ModelsSkeletonsArray';

const UserModelsInfo = observer(({ userId }) => {
    const { model } = useContext(Context);
    const [filteredModels, setFilteredModels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadModels = async () => {
            setLoading(true);
            try {
                await model.loadUserPurchasedModels(userId);
            } catch (error) {
                console.error('Error loading user models:', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadModels();
    }, [userId]);

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
            <h3>Purchased Models</h3>
            <Search 
                data={model.userPurchasedModels}
                setFilteredData={setFilteredModels}
                searchFields={['id', 'name']}
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
                        <span className="no-info-container">
                            {model.userPurchasedModels.length > 0 ? 'No models found' : 'No models purchased'}
                        </span>
                    )
                )}
            </div>
        </div>
    );
});

export default UserModelsInfo;
