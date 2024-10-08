import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { Spinner, Button, Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createReturn } from '../../http/orderAPI';
import styles from './UserAccount.module.css';
import { GiHighHeel } from "react-icons/gi";
import { Dropdown, Menu, message } from 'antd'; // Импортируем AutoComplete из antd
import { LiaExchangeAltSolid } from "react-icons/lia";
import { IoReturnDownBackOutline } from "react-icons/io5";
import { SlOptionsVertical } from "react-icons/sl";
import { CustomOffcanvasHeader, CustomOffcanvas, CustomOffcanvasBody } from '../../components/StyledComponents';
import { PiKeyReturnFill } from "react-icons/pi";
import BackButton from '../../components/BackButton/BackButton';
import { THING_ROUTE } from '../../utils/consts';
import { SiTether, SiBitcoinsv, SiEthereum, SiLitecoin } from "react-icons/si";
import {Select, Input} from 'antd';
import UserOrders from '../../components/UserComponents/UserOrders';
import UserReturns from '../../components/UserComponents/UserReturns';
import UserExchanges from '../../components/UserComponents/UserExchanges';

const UserAccount = observer(() => {
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [selectedThing, setSelectedThing] = useState(null); // Выбранный товар для возврата
    const [reason, setReason] = useState('');
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [openDropdowns, setOpenDropdowns] = useState({});
    const [cryptoCurrency, setCryptoCurrency] = useState('usdt');
    const [cryptoWalletAddress, setCryptoWalletAddress] = useState('');


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

        setOpenDropdowns(prevState => ({
            ...prevState,
            [thingItem.id]: false,
        }));
    };

    const handleExchangeRequest = (thingItem) => {
        navigate(`/exchange/${thingItem.id}`); // Перенаправляем на страницу обмена, передавая ID товара
    };

    const wallets = {
        usdt: {
            address: "0x5541a5FD4Cc660F356601DBeCdD2be3e19548095",
            currency: "USDT",
            icon: <SiTether/>,
        },
        bitcoin: {
            address: "bc1q0jh3phrlml2y3uszj38w33jmrhefydk36ekvv0",
            currency: "BTC",
            icon: <SiBitcoinsv/>,
        },
        ethereum: {
            address: "0x5541a5FD4Cc660F356601DBeCdD2be3e19548095",
            currency: "ETH",
            icon: <SiEthereum/>,
        },
        litecoin: {
            address: "ltc1qe6jl3ah8ar586rzjv7lj4aypssx4j6wlscxj2s",
            currency: "LTC",
            icon: <SiLitecoin/>,
        },
    };

    const handleSubmitReturn = async () => {
        const refundAmount = selectedThing.price;
        try {
            await createReturn({
                thingId: selectedThing.id,
                reason: reason || '',
                cryptoCurrency: wallets[cryptoCurrency].currency,
                cryptoWalletAddress,
                refundAmount,
            });
            message.success('Await refund confirmation');
            setTimeout(async () => {
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

    if (user.loading) {
        return <Spinner animation="border" />;
    }

    if (!user.userInfo) {
        return <p>Failed to upload user information.</p>;
    }

    return (
        <div className={styles.useraccount}>

            <div className={styles.topic}>
                <div className={styles.topic_back}>
                    <BackButton />
                    <h2>User Account</h2>
                </div>
                <div className={styles.userinfo}>
                    <p>{user.userInfo.email}</p>
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
                                <div className={styles.thing_item} key={thingItem.id} >
                                    <div className={styles.thing_image_wrapper} style={{zIndex: '100'}}>
                                        {thingItem.images && thingItem.images.length > 0 && (
                                            <img
                                                src={`${process.env.REACT_APP_API_URL}/${thingItem.images[0].img}`}
                                                alt={thingItem.name}
                                                className={styles.thing_image}
                                                onError={(e) => { e.target.src = '/path/to/default/image.jpg'; }}
                                                onClick={() => navigate(THING_ROUTE + "/" + thingItem.id)}
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
                    <span className={styles.placeholder}>You don't have any Models.</span>
                )}
            </div>

            <UserOrders orders={user.userInfo.orders} sliderSettings={sliderSettings} />

            <UserReturns returns={user.userInfo.returns} sliderSettings={sliderSettings} />

            <UserExchanges exchanges={user.userInfo.exchangeRequests} sliderSettings={sliderSettings} />

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
                                <div className={styles.selector_pay}>
                                <label htmlFor="cryptoSelect">Choose a cryptocurrency for refund:</label>
                                <Select
                                    id="cryptoSelect"
                                    value={cryptoCurrency}
                                    onChange={(value) => setCryptoCurrency(value)}
                                    placeholder="Select"
                                    suffixIcon={<span/>}
                                    options={Object.keys(wallets).map((key) => ({
                                        label: (
                                            <div className={styles.crypto_selector}>
                                                <span>{wallets[key].currency}</span>
                                                <span>{wallets[key].icon}</span>
                                            </div>
                                        ),
                                        value: key,
                                    }))}
                                />
                            </div>
                            <div className={styles.wallet_input}>
                                <label htmlFor="walletAddress">Enter your wallet address:</label>
                                <Input
                                    id="walletAddress"
                                    value={cryptoWalletAddress}
                                    onChange={(e) => setCryptoWalletAddress(e.target.value)}
                                    placeholder="Wallet address"
                                />
                            </div>
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














