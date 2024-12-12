import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../../../index';
import { Spin } from 'antd';
import styles from './UserInfoComponents.module.css';
import { useNavigate } from 'react-router-dom';
import { THING_ROUTE } from '../../../utils/consts';
import Search from '../../UI/Search/Search';

const UserModelsInfo = observer(({ userId }) => {
    const { model } = useContext(Context);
    const navigate = useNavigate();
    const [filteredModels, setFilteredModels] = useState([]);

    useEffect(() => {
        model.loadUserPurchasedModels(userId);
    }, [userId]);

    const formatModelOption = (model) => ({
        value: model.id.toString(),
        label: `${model.name} (ID: ${model.id})`
    });

    if (model.purchasedModelsLoading) {
        return <Spin tip="Loading models..." />;
    }

    return (
        <div className={styles.models}>
            <h3>Purchased Models</h3>
            <Search 
                data={model.userPurchasedModels}
                setFilteredData={setFilteredModels}
                searchFields={['id', 'name']}
                placeholder="Search by model name or ID"
                formatOption={formatModelOption}
            />
            {filteredModels.length > 0 ? (
                <div className={styles.models_grid}>
                    {filteredModels.map(model => (
                        <div 
                            key={model.id} 
                            className={styles.model_card}
                            onClick={() => navigate(THING_ROUTE + "/" + model.id)}
                        >
                            <div className={styles.model_image}>
                                <img 
                                    src={`${process.env.REACT_APP_API_URL}/${model.images[0].img}`} 
                                    alt={model.name} 
                                />
                            </div>
                            <div className={styles.model_info}>
                                <h4>{model.name}</h4>
                                <span className={styles.model_price}>${model.priceUSD}</span>
                            </div>
                            {model.adultPlatforms && model.adultPlatforms.length > 0 && (
                                <div className={styles.model_platforms}>
                                    {model.adultPlatforms.map(platform => (
                                        <span key={platform.id} className={styles.platform_tag}>
                                            {platform.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.no_models}>
                    {model.userPurchasedModels.length > 0 ? 'No models found' : 'No models purchased'}
                </div>
            )}
        </div>
    );
});

export default UserModelsInfo;
