import { useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../../../index';
import useUserData from '../../../hooks/useUserData';
import TopicBack from '../../../components/FuctionalComponents/TopicBack/TopicBack';
import styles from './UserInfoPage.module.css'
import { THING_ROUTE, ADMIN_ROUTE } from '../../../utils/consts';
import UserModelsInfo from '../../../components/AdminComponents/UserInfoComponents/UserModelsInfo';
import UserOrdersInfo from '../../../components/AdminComponents/UserInfoComponents/UserOrdersInfo';
import { useState } from 'react';
import { Select, Button, Popconfirm, message } from 'antd';
import LoadingIndicator from '../../../components/UI/LoadingIndicator/LoadingIndicator';

const { Option } = Select;

const UserInfoPage = () => {
    const { id } = useParams(); 
    const { userData, loading } = useUserData(id);
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState('models');
    const { admin } = useContext(Context);

    const roleOptions = ['USER', 'ADMIN', 'SELLER'];

    const handleRoleChange = async (newRole) => {
        try {
            await admin.changeUserRole(id, newRole);
            message.success('User role successfully changed!');
        } catch (error) {
            console.error('Error changing user role:', error);
            message.error('Error changing user role');
        }
    };

    const handleDeleteUser = async () => {
        try {
            await admin.deleteUser(id);
            message.success('User successfully deleted!');
            navigate(ADMIN_ROUTE + '/users');
        } catch (error) {
            console.error('Error deleting user:', error);
            message.error('Error deleting user');
        }
    };

    if (loading) {
        return <LoadingIndicator />;
    }
    if (!userData) {
        return <div>User not found</div>;
    }

    return (
        <div className="container">
            <TopicBack title={`User Info`} />
            <div className={styles.user}>
                <div className={styles.user_info}>
                    <div className={styles.user_name}>
                        <h4>{userData.email || `@${userData.username}` || `Telegram ID: ${userData.telegramId}`}</h4>
                        <h4>ID: {userData.id}</h4>
                    </div>
                    <div className={styles.user_role}>
                        <Select
                            defaultValue={userData.role}
                            onChange={handleRoleChange}
                            style={{width: 'calc(var(--index) * 9)'}}
                        >
                            {roleOptions.map(role => (
                                <Option key={role} value={role}>
                                    {role}
                                </Option>
                            ))}
                        </Select>
                        <Popconfirm
                            title={`Are you sure you want to delete user ${userData.email || `@${userData.username}` || `Telegram ID: ${userData.telegramId}`}?`}
                            onConfirm={handleDeleteUser}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" danger>
                                Delete user
                            </Button>
                        </Popconfirm>
                    </div>
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
            
            {selectedTab === 'models' && (
                <UserModelsInfo userId={userData.id} />
            )}

            {selectedTab === 'orders' && (
                <UserOrdersInfo userId={userData.id} />
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
