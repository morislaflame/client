import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../../../index';
import { observer } from 'mobx-react-lite';
import { Card, Space, Button, message, Modal, Descriptions, Rate, List, Divider } from 'antd';
import { UserOutlined, ShopOutlined, StarOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import styles from './SellerInfoPage.module.css';
import TopicBack from '../../../components/FuctionalComponents/TopicBack/TopicBack';

const SellerInfoPage = observer(() => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { admin } = useContext(Context);
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSellerInfo();
    }, [id]);

    const loadSellerInfo = async () => {
        try {
            const data = await admin.getSellerById(id);
            setSeller(data);
        } catch (error) {
            message.error('Ошибка при загрузке информации о продавце');
            console.error('Error loading seller:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async () => {
        Modal.confirm({
            title: 'Подтверждение',
            content: 'Вы уверены, что хотите снять статус продавца? Все его товары будут удалены.',
            okText: 'Да',
            cancelText: 'Нет',
            onOk: async () => {
                try {
                    await admin.changeUserRole(id, 'USER');
                    message.success('Статус продавца успешно снят');
                    navigate('/admin/sellers');
                } catch (error) {
                    message.error('Ошибка при изменении роли пользователя');
                    console.error('Error changing user role:', error);
                }
            }
        });
    };

    if (loading) {
        return <Card loading={true} />;
    }

    if (!seller) {
        return <Card><h2>Продавец не найден</h2></Card>;
    }

    return (
        <div className={styles.seller_info}>
            <TopicBack title="Seller Profile" />
            <Space direction="vertical" style={{ width: '100%' }}>
                <Descriptions bordered>
                    <Descriptions.Item label="ID" span={3}>
                        <IdcardOutlined /> {seller.id}
                    </Descriptions.Item>
                    
                    {seller.email && (
                        <Descriptions.Item label="Email" span={3}>
                            <MailOutlined /> {seller.email}
                        </Descriptions.Item>
                    )}
                    
                    {seller.username && (
                        <Descriptions.Item label="Username" span={3}>
                            <UserOutlined /> {seller.username}
                        </Descriptions.Item>
                    )}
                    
                    {seller.telegramId && (
                        <Descriptions.Item label="Telegram ID" span={3}>
                            <UserOutlined /> {seller.telegramId}
                        </Descriptions.Item>
                    )}
                    
                    {seller.sellerInformation?.sellerName && (
                        <Descriptions.Item label="Название магазина" span={3}>
                            <ShopOutlined /> {seller.sellerInformation.sellerName}
                        </Descriptions.Item>
                    )}
                    
                    {seller.sellerInformation?.sellerInfo && (
                        <Descriptions.Item label="Информация о продавце" span={3}>
                            {seller.sellerInformation.sellerInfo}
                        </Descriptions.Item>
                    )}
                    
                    <Descriptions.Item label="Рейтинг" span={3}>
                        <StarOutlined /> 
                        <Rate disabled defaultValue={seller.sellerInformation?.sellerRating || 0} />
                        ({seller.sellerInformation?.sellerRating || 0})
                    </Descriptions.Item>
                </Descriptions>

                {seller.sellerReviews && seller.sellerReviews.length > 0 && (
                    <>
                        <Divider>Отзывы</Divider>
                        <List
                            itemLayout="vertical"
                            dataSource={seller.sellerReviews}
                            renderItem={review => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={`${review.user.username || review.user.email || 'Аноним'}`}
                                        description={
                                            <Rate disabled defaultValue={review.rating} />
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </>
                )}
            </Space>
        </div>
    );
});

export default SellerInfoPage;
