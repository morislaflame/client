import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../index";
import { useNavigate } from "react-router-dom";
import { ORDER_ROUTE } from "../../utils/consts";
import ModelHelperCard from "../MainComponents/ModelHelperCard/ModelHelperCard";
import LoadingIndicator from "../UI/LoadingIndicator/LoadingIndicator";
import styles from './UserComponents.module.css';

const UserModelsList = observer(() => {
    const { model, user } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUserModels = async () => {
            setLoading(true);
            try {
                await model.loadUserPurchasedModels(user.user.id);
            } catch (error) {
                console.error('Error loading user models:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user.user?.id) {
            loadUserModels();
        }
    }, [user.user?.id]);

    if (loading) {
        return <LoadingIndicator />;
    }

    if (!model.userPurchasedModels.length) {
        return <div className="no-info-container">You haven't purchased any models yet</div>;
    }

    return (
        <div className={styles.models_list}>
            {model.userPurchasedModels.map(modelProduct => {
                const actions = (
                    <button
                        className={styles.view_order}
                        onClick={() => navigate(`${ORDER_ROUTE}/${modelProduct.orders[0]?.id}`)}
                    >
                        View Order
                    </button>
                );

                return (
                    <ModelHelperCard
                        key={modelProduct.id}
                        modelProduct={modelProduct}
                        showDelete={false}
                        actions={actions}
                    />
                );
            })}
        </div>
    );
});

export default UserModelsList;