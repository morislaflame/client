import React from 'react';
import styles from './UserInfoComponents.module.css';

const UserModelsInfo = ({ models }) => {
    return (
        <div className={styles.models}>
            <h3>Purchased Models</h3>
            {models.length > 0 ? (
                models.map(model => (
                    <div key={model.id} className={styles.model}>
                        <img src={`${process.env.REACT_APP_API_URL}/${model.images[0].img}`} alt={model.name} />
                        <span>{model.name}</span> — <span>${model.priceUSD}</span>
                    </div>
                ))
            ) : (
                <p>No models purchased</p>
            )}
        </div>
    );
};

export default UserModelsInfo;
