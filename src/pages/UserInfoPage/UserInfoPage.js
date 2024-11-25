import { useParams } from 'react-router-dom';
import useUserData from '../../hooks/useUserData';
import BackButton from '../../components/UI/BackButton/BackButton';
import styles from '../UserAccount/UserAccount.module.css'
import UserOrders from '../../components/UserComponents/UserOrders'; 
import UserReturns from '../../components/UserComponents/UserReturns';
import UserExchanges from '../../components/UserComponents/UserExchanges';

const UserInfoPage = () => {
    const { id } = useParams(); 
    const { userData, loading } = useUserData(id);


    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        autoplay: false,
        slidesToShow: 1,
        arrows: false,
        centerMode: true,
        centerPadding: "20px",
        focusOnSelect: true,
        adaptiveHeight: true,
        appendDots: dots => (
            <div
              style={{
                color: 'white',
                borderRadius: "10px",
                padding: "10px"
              }}
            >
              <ul style={{ margin: "0px" }}> {dots} </ul>
            </div>
          ),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    if (!userData) {
        return <div>User not found</div>;
    }


    return (
        <div className={styles.user_info}>
            <div className={styles.topic_back}>
                <BackButton/>
                <h2>User Info</h2>
            </div>
            <div className={styles.user}>
                <p>Email: {userData.email || `@${userData.username}` || `Telegram ID: ${userData.telegramId}`}</p>
                <p>Роль: {userData.role}</p>
                <p>ID: {userData.id}</p>
            </div>
            
            <h3>Корзина</h3>
            {userData.basketItems && userData.basketItems.length > 0 ? (
                <div className={styles.basket}>
                    {userData.basketItems.map(basketItem => (
                        <div key={basketItem.id}>
                            <span>{basketItem.modelProduct.name}</span> — <span>${basketItem.modelProduct.priceUSD}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Корзина пуста</p>
            )}
            

            <UserOrders orders={userData.orders} sliderSettings={sliderSettings} />

            <UserReturns returns={userData.returns} sliderSettings={sliderSettings} />

            <UserExchanges exchanges={userData.exchangeRequests} sliderSettings={sliderSettings} />
        </div>
    );
};

export default UserInfoPage;
