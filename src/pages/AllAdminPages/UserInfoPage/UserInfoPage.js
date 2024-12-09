import { useParams, useNavigate } from 'react-router-dom';
import useUserData from '../../../hooks/useUserData';
import TopicBack from '../../../components/FuctionalComponents/TopicBack/TopicBack';
import styles from './UserInfoPage.module.css'
import { THING_ROUTE } from '../../../utils/consts';
import UserOrders from '../../../components/UserComponents/UserOrders'; 
import UserReturns from '../../../components/UserComponents/UserReturns';

const UserInfoPage = () => {
    const { id } = useParams(); 
    const { userData, loading } = useUserData(id);
    const navigate = useNavigate();

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
                <h4>Email: {userData.email || `@${userData.username}` || `Telegram ID: ${userData.telegramId}`}</h4>
                <div className={styles.user_info}>
                    <span>{userData.role}</span>
                    <span>ID: {userData.id}</span>
                </div>
            </div>
            
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
            

            {/* <UserOrders orders={userData.orders} sliderSettings={sliderSettings} />

            <UserReturns returns={userData.returns} sliderSettings={sliderSettings} /> */}
        </div>
    );
};

export default UserInfoPage;
