import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { Spinner, Button, Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createReturn } from '../../http/orderAPI';
import styles from './UserAccount.module.css';
import { message } from 'antd';
import { CustomOffcanvasHeader, CustomOffcanvas, CustomOffcanvasBody } from '../../components/StyledComponents';
import { PiKeyReturnFill } from "react-icons/pi";
import BackButton from '../../components/BackButton/BackButton';
import { SiTether, SiBitcoinsv, SiEthereum, SiLitecoin } from "react-icons/si";
import {Select, Input} from 'antd';
import UserOrders from '../../components/UserComponents/UserOrders';
import UserReturns from '../../components/UserComponents/UserReturns';
import UserExchanges from '../../components/UserComponents/UserExchanges';
import UserModels from '../../components/UserComponents/UserModels';

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


    const handleClose = useCallback(() => {
        setShow(false);
        setConfirmationMessage('');
        setReason('');
    }, []);

    const handleShow = useCallback((thing) => {
        setSelectedThing(thing);
        setShow(true);
    }, []);

    useEffect(() => {
        user.loadUserInfo();
    }, [user]);

    const handleExchangeRequest = useCallback((thingItem) => {
        navigate(`/exchange/${thingItem.id}`); // Перенаправляем на страницу обмена, передавая ID товара
    }, [navigate]);

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

    const handleSubmitReturn = useCallback(async () => {
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
    }, [cryptoCurrency, cryptoWalletAddress, handleClose, reason, selectedThing, user]);

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
        lazyLoad: 'ondemand',
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

            
            <UserModels 
                ownedThings={user.userInfo.ownedThings} 
                exchangeRequests={user.userInfo.exchangeRequests} 
                returns={user.userInfo.returns} 
                handleShow={handleShow} 
                handleExchangeRequest={handleExchangeRequest} // Передаем как пропс
            />

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
