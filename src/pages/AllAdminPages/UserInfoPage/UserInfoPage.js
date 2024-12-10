import { useParams, useNavigate } from 'react-router-dom';
import useUserData from '../../../hooks/useUserData';
import TopicBack from '../../../components/FuctionalComponents/TopicBack/TopicBack';
import styles from './UserInfoPage.module.css'
import { THING_ROUTE } from '../../../utils/consts';
import UserModelsInfo from '../../../components/AdminComponents/UserInfoComponents/UserModelsInfo';
import UserOrdersInfo from '../../../components/AdminComponents/UserInfoComponents/UserOrdersInfo';
import { useState } from 'react';

const UserInfoPage = () => {
    const { id } = useParams(); 
    const { userData, loading } = useUserData(id);
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState('models');

    if (loading) {
        return <div>Loading...</div>;
    }
    if (!userData) {
        return <div>User not found</div>;
    }

    return (
        <div className="container">
            <TopicBack title={`User Info`} />
            <div className={styles.user}>
                <div className={styles.user_info}>
                    <h4>{userData.email || `@${userData.username}` || `Telegram ID: ${userData.telegramId}`}</h4>
                    <div className={styles.user_role}>
                        <span>{userData.role}</span>
                        <span>ID: {userData.id}</span>
                    </div>
                </div>
                <div className={styles.menu_links}>
                    <button 
                        className={`${styles.menu_link} ${selectedTab === 'models' ? styles.active : ''}`}
                        onClick={() => setSelectedTab('models')}
                    >
                        Models
                    </button>
                    <button 
                        className={`${styles.menu_link} ${selectedTab === 'orders' ? styles.active : ''}`}
                        onClick={() => setSelectedTab('orders')}
                    >
                        Orders
                    </button>
                    <button 
                        className={`${styles.menu_link} ${selectedTab === 'liked' ? styles.active : ''}`}
                        onClick={() => setSelectedTab('liked')}
                    >
                        Liked
                    </button>
                </div>
            </div>
            
            {selectedTab === 'models' && (
                <UserModelsInfo models={userData.ownedProducts || []} />
            )}

            {selectedTab === 'orders' && (
                <UserOrdersInfo orders={userData.orders || []} />
            )}
            
            {selectedTab === 'liked' && (
                <>
                    <h3>Liked</h3>
                    {userData.basketItems && userData.basketItems.length > 0 ? (
                        <div 
                            className={styles.basket}
                            onClick={() => navigate(THING_ROUTE + "/" + userData.basketItems[0].modelProduct.id)}
                        >
                            {userData.basketItems.map(basketItem => (
                                <div key={basketItem.id} className={styles.basket_item}>
                                    <img src={`${process.env.REACT_APP_API_URL}/${basketItem.modelProduct.images[0].img}`} alt={basketItem.modelProduct.name} />
                                    <span>{basketItem.modelProduct.name}</span> — <span>${basketItem.modelProduct.priceUSD}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Корзина пуста</p>
                    )}
                </>
            )}
        </div>
    );
};

export default UserInfoPage;
