import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { Spinner, Button, Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createReturn } from '../../http/orderAPI';
import styles from './UserAccount.module.css';
import { GiHighHeel } from "react-icons/gi";
import { Dropdown, Menu, message } from 'antd';
import { LiaExchangeAltSolid } from "react-icons/lia";
import { IoReturnDownBackOutline } from "react-icons/io5";
import { FcCancel, FcClock, FcOk } from "react-icons/fc";
import { SlOptionsVertical } from "react-icons/sl";
import { CustomOffcanvasHeader, CustomOffcanvas, CustomOffcanvasBody } from '../../components/StyledComponents';
import { PiKeyReturnFill } from "react-icons/pi";
import BackButton from '../../components/BackButton/BackButton';



const UserAccount = observer(() => {
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [selectedThing, setSelectedThing] = useState(null); // Выбранный товар для возврата
    const [reason, setReason] = useState('');
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [openDropdowns, setOpenDropdowns] = useState({});

    const handleClose = () => {
        setShow(false);
        setConfirmationMessage('');
        setReason('');
    };

    const handleShow = (thing) => {
        setSelectedThing(thing);
        setShow(true);
    };

    const handleDropdownVisibleChange = (flag, thingId) => {
        setOpenDropdowns(prevState => ({
            ...prevState,
            [thingId]: flag,
        }));
    };

    useEffect(() => {
        user.loadUserInfo();
    }, [user]);

    

    const handleMenuClick = (action, thingItem) => {
        if (action === 'exchange') {
            handleExchangeRequest(thingItem);
        } else if (action === 'return') {
            handleShow(thingItem);
            
        }
    };

    const handleExchangeRequest = (thingItem) => {
        navigate(`/exchange/${thingItem.id}`); // Перенаправляем на страницу обмена, передавая ID товара
    };

    const handleSubmitReturn = async () => {
        try {
            await createReturn({
                thingId: selectedThing.id,
                reason: reason || '',
            });
            message.success('Await refund confirmation');
            setTimeout(async() => {
                handleClose();
                await user.loadUserInfo();
            }, 3000);
             // Заново загружаем информацию о пользователе
        } catch (e) {
            console.error('Error creating a return:', e);
            message.error('Error creating a return');
        }
    };
    

    const getDropdownMenu = (thingItem, hasExchangeRequest, hasReturnRequest) => (
        <Menu>
            <Menu.Item
                key="exchange"
                icon={<LiaExchangeAltSolid />}
                disabled={hasExchangeRequest}
                onClick={() => handleMenuClick('exchange', thingItem)}
            >
                {hasExchangeRequest ? 'Exchange request sent' : 'Request an exchange'}
            </Menu.Item>
            <Menu.Item
                key="return"
                icon={<IoReturnDownBackOutline />}
                disabled={hasReturnRequest}
                onClick={() => handleMenuClick('return', thingItem)}
            >
                {hasReturnRequest ? 'Return in processing' : 'Make a refund'}
            </Menu.Item>
        </Menu>
    );

    if (user.loading) {
        return <Spinner animation="border" />;
    }

    if (!user.userInfo) {
        return <p>Failed to upload user information.</p>;
    }

    return (
        <div className={styles.useraccount}>
            
            <div className={styles.topic}>
            <div className={styles.topic_back}><BackButton/><h2>User Account</h2></div>
                <div className={styles.userinfo}>
                    <p>Email: {user.userInfo.email}</p>
                    <p>Роль: {user.userInfo.role}</p>
                </div>
            </div>

            {/* Товары пользователя */}
            <div className={styles.my_things}>
                <h3>My Models</h3>
                {user.userInfo.ownedThings && user.userInfo.ownedThings.length > 0 ? (
                    <div className={styles.things_list}>
                        {user.userInfo.ownedThings.map(thingItem => {
                            const hasExchangeRequest = user.userInfo.exchangeRequests?.some(
                                exchange => exchange.oldThingId === thingItem.id && exchange.status === 'pending'
                            );

                            const hasReturnRequest = user.userInfo.returns?.some(
                                returnItem => returnItem.thingId === thingItem.id && returnItem.status === 'pending'
                            );

                            return (
                                <div className={styles.thing_item} key={thingItem.id}>
                                    <div className={styles.thing_image_wrapper}>
                                        {thingItem.images && thingItem.images.length > 0 && (
                                            <img
                                                src={`${process.env.REACT_APP_API_URL}/${thingItem.images[0].img}`}
                                                alt={thingItem.name}
                                                className={styles.thing_image}
                                                onError={(e) => { e.target.src = '/path/to/default/image.jpg'; }}
                                            />
                                        )}
                                    </div>
                                    <div className={styles.thing_details}>
                                        <div className={styles.name_price}>
                                            <div className={styles.name_heel}>
                                                <GiHighHeel /><span>{thingItem.name}</span>
                                            </div>
                                            <span>${thingItem.price}</span>
                                        </div>
                                        <div className={styles.dropdownmenusection}>
                                            <Dropdown
                                                overlay={getDropdownMenu(thingItem, hasExchangeRequest, hasReturnRequest)}
                                                trigger={['click']}
                                                onVisibleChange={(flag) => handleDropdownVisibleChange(flag, thingItem.id)}
                                                visible={openDropdowns[thingItem.id] || false}
                                            >
                                                <div className={styles.dropdownmenu}>
                                                    <div onClick={e => e.preventDefault()} className={styles.dropdownTrigger}>
                                                        <span>Actions</span>
                                                        <SlOptionsVertical
                                                            className={`${styles.rotateIcon} ${openDropdowns[thingItem.id] ? styles.open : ''}`}
                                                        />
                                                    </div>
                                                </div>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p>You don't have any Models.</p>
                )}
            </div>

            {/* Раздел заказов */}
            <div className={styles.orders}>
                <h3>My Orders</h3>
                {user.userInfo.orders && user.userInfo.orders.length > 0 ? (
                    <div className={styles.order_list}>
                        {user.userInfo.orders.map(order => (
                            <div className={styles.order_item} key={order.id}>
                                <div className={styles.order_status}>
                                    <span>Order №{order.id}</span> 
                                    
                                </div>
                                <div className={styles.order_details}>
                                    <div className={styles.ladies}>
                                        {order.order_things.map(item => (
                                            <div className={styles.name_price} key={item.id}>
                                                <div className={styles.name_heel}>
                                                    <GiHighHeel />
                                                    model: <b>{item.thing.name}</b>
                                                </div>
                                                <span>${item.thing.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.total_price}>Total: ${order.totalPrice} </div>
                                    <div className={styles.mini_status}>
                                        {order.status === 'created' && (
                                            <div className={styles.approved}><FcClock style={{ color: 'black' }} /><p>Your order is pending confirmation</p></div>
                                        )}
                                        {order.status === 'paid' && (
                                            <div className={styles.approved}><FcOk /><p>Your order has been successfully paid</p></div>
                                        )}
                                        {order.status === 'rejected' && (
                                            <div className={styles.approved}><FcCancel /><p>Your order has been rejected</p></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>У вас нет заказов.</p>
                )}
            </div>

            {/* Раздел возвратов */}
            <div className={styles.returns}>
                <h3>My Returns</h3>
                {user.userInfo.returns && user.userInfo.returns.length > 0 ? (
                    <div className={styles.order_list}>
                        {user.userInfo.returns.map(returnItem => (
                            <div className={styles.order_item} key={returnItem.id}>
                                <div className={styles.order_status}>
                                    <span>Return №{returnItem.id}</span> 
                                </div>
                                <div className={styles.return_details}>
                                    <div className={styles.ladies}>
                                        <div className={styles.name_price}>
                                            <div className={styles.name_heel}>
                                                <GiHighHeel />
                                                model: {returnItem.thing.name}
                                            </div>
                                            <span>${returnItem.thing.price}</span>
                                        </div>
                                    </div>
                                    <div className={styles.mini_status_return}>
                                            {returnItem.status === 'pending' && (
                                                <div className={styles.approved}><FcClock style={{ color: 'black' }} /><p>The refund request is being reviewed</p></div>
                                            )}
                                            {returnItem.status === 'approved' && (
                                                <div className={styles.approved}><FcOk /><p>Successful refund </p></div>
                                            )}
                                            {returnItem.status === 'rejected' && (
                                                <div className={styles.approved}><FcCancel /><p>Refund request denied</p></div>
                                            )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You have no returns.</p>
                )}
            </div>

            {/* Раздел запросов на обмен */}
            <div className={styles.exchanges}>
                <h3>My Exchanges</h3>
                {user.userInfo.exchangeRequests && user.userInfo.exchangeRequests.length > 0 ? (
                    <div className={styles.exchange_list}>
                        {user.userInfo.exchangeRequests.map(exchange => (
                            <div className={styles.exchange_item} key={exchange.id}>
                                <div className={styles.exchange_status}>
                                    <span>Exchange №{exchange.id}</span>
                                    {/* <span> {exchange.status}</span> */}
                                </div>
                                <div className={styles.exchange_details}>
                                    <div className={styles.old_new}>
                                        <div className={styles.old_new_names}>
                                            <div><strong>Swapped:</strong></div> {exchange.OldThing.name} - ${exchange.OldThing.price}
                                        </div>
                                        <div className={styles.old_new_names}>
                                            <div><strong>For:</strong></div> {exchange.NewThing.name} - ${exchange.NewThing.price}
                                        </div>
                                    </div>

                                    <div>
                                        <strong>Price Difference:</strong> ${exchange.priceDifference}
                                    </div>
                                    <div className={styles.mini_status}>
                                        {exchange.status === 'pending' && (
                                            <div className={styles.approved}><FcClock style={{ color: 'black' }} /><p>Your exchange request is being processed</p></div>
                                        )}
                                        {exchange.status === 'approved' && (
                                            <div className={styles.approved}><FcOk /><p>Your exchange request has been approved</p></div>
                                        )}
                                        {exchange.status === 'rejected' && (
                                            <div className={styles.approved}><FcCancel /><p>Your exchange request has been denied</p></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>У вас нет запросов на обмен.</p>
                )}
            </div>

            <CustomOffcanvas show={show} onHide={handleClose} placement="bottom">
                <CustomOffcanvasHeader>
                    <Offcanvas.Title className={styles.offcanv_header}>Refund request</Offcanvas.Title>
                </CustomOffcanvasHeader>
                <CustomOffcanvasBody>
                    {selectedThing && (
                        <>
                        <div className={styles.selection}>
                            <div className={styles.selection_name}>
                                <span>{selectedThing.name}</span>
                                <span>${selectedThing.price}</span>
                            </div>
                            <textarea
                                placeholder="Reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                style={{ width: '100%', minHeight: '100px', marginBottom: '10px' }}
                            />
                        </div>
                            
                            <Button onClick={handleSubmitReturn} style={{
                                display: 'flex',
                                width: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '7px',
                                
                            }} className={styles.button}>
                                <span>Make a refund</span>
                                <PiKeyReturnFill />
                            </Button>
                            {confirmationMessage && <p>{confirmationMessage}</p>}
                        </>
                    )}
                </CustomOffcanvasBody>
            </CustomOffcanvas>
        </div>
    );
});

export default UserAccount;
