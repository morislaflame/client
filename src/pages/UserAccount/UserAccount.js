import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { Spinner, Button, Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createReturn } from '../../http/orderAPI';
import styles from './UserAccount.module.css';
import { GiHighHeel } from "react-icons/gi";
import { Dropdown, Menu, message, AutoComplete } from 'antd'; // Импортируем AutoComplete из antd
import { LiaExchangeAltSolid } from "react-icons/lia";
import { IoReturnDownBackOutline } from "react-icons/io5";
import { FcCancel, FcClock, FcOk } from "react-icons/fc";
import { SlOptionsVertical } from "react-icons/sl";
import { CustomOffcanvasHeader, CustomOffcanvas, CustomOffcanvasBody } from '../../components/StyledComponents';
import { PiKeyReturnFill } from "react-icons/pi";
import BackButton from '../../components/BackButton/BackButton';
import Slider from 'react-slick';
import { THING_ROUTE } from '../../utils/consts';
import { SiTether, SiBitcoinsv, SiEthereum, SiLitecoin } from "react-icons/si";
import {Select, Input} from 'antd';

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

    // Состояния для поисковых запросов
    const [orderSearch, setOrderSearch] = useState('');
    const [returnSearch, setReturnSearch] = useState('');
    const [exchangeSearch, setExchangeSearch] = useState('');

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

    // Создаем опции для AutoComplete
    const orderOptions = user.userInfo.orders.map(order => ({
        value: order.id.toString(),
    }));

    const returnOptions = user.userInfo.returns.map(ret => ({
        value: ret.id.toString(),
    }));

    const exchangeOptions = user.userInfo.exchangeRequests.map(exchange => ({
        value: exchange.id.toString(),
    }));

    // Фильтрация данных на основе поисковых запросов
    const filteredOrders = orderSearch
        ? user.userInfo.orders.filter(order =>
            order.id.toString().includes(orderSearch.trim())
          )
        : user.userInfo.orders;

    const filteredReturns = returnSearch
        ? user.userInfo.returns.filter(ret =>
            ret.id.toString().includes(returnSearch.trim())
          )
        : user.userInfo.returns;

    const filteredExchanges = exchangeSearch
        ? user.userInfo.exchangeRequests.filter(exchange =>
            exchange.id.toString().includes(exchangeSearch.trim())
          )
        : user.userInfo.exchangeRequests;

    const hasReturns = user.userInfo.returns && user.userInfo.returns.length > 0;
    const hasExchanges = user.userInfo.exchangeRequests && user.userInfo.exchangeRequests.length > 0;

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

            {/* Раздел заказов */}
            <div className={styles.orders}>
                <div className={styles.order_top}>
                    <h5>Orders</h5>
                    <AutoComplete
                        options={orderOptions}
                        onSelect={value => setOrderSearch(value)}
                        onSearch={value => setOrderSearch(value)}
                        placeholder="Search Order"
                        allowClear
                        variant="filled"
                        className={styles.search}
                    />
                </div>
                
                {filteredOrders && filteredOrders.length > 0 ? (
                    <Slider {...sliderSettings} className={styles.slider}>
                        {filteredOrders.map(order => (
                            <div className={styles.order_list} key={order.id}>
                                <div className={styles.order_item}>
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
                                            <div className={styles.other_info}>
                                                {order.promo_code !== null && (
                                                    <div className={styles.promocode_status}>
                                                        <span>Promocode:</span> <strong>{order.promo_code.code} ${order.promo_code.discountValue}</strong>
                                                    </div>
                                                )}
                                                <div className={styles.promocode_status}>
                                                    <span>Currency:</span> <strong>{order.cryptoCurrency}</strong>
                                                </div>
                                                <div className={styles.promocode_status}>
                                                    <span>Amount:</span> <strong>{order.cryptoPaymentAmount}</strong>
                                                </div>
                                                <div className={styles.promocode_status}>
                                                    <span>Hash:</span> <strong>{order.cryptoTransactionHash}</strong>
                                                </div>
                                                
                                            </div>
                                            <div className={styles.total_price}>Total: ${order.totalPrice} </div>
                                        </div>
                                        
                                        <div className={styles.mini_status}>

                                            {order.status === 'created' && (
                                                <div className={styles.approved}><FcClock style={{ color: 'black' }} /><p>Your order is pending confirmation</p></div>
                                            )}
                                            {order.status === 'paid' && (
                                                <div className={styles.approved}><FcOk /><span>Successfully paid</span></div>
                                            )}
                                            {order.status === 'rejected' && (
                                                <div className={styles.approved}><FcCancel /><p>The order was rejected</p></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <p>У вас нет заказов с указанным ID.</p>
                )}
            </div>

            {/* Раздел возвратов */}
            {hasReturns && (
            <div className={styles.returns}>
                <div className={styles.order_top}>
                    <h5>Returns</h5>
                    <AutoComplete
                        options={returnOptions}
                        onSelect={value => setReturnSearch(value)}
                        onSearch={value => setReturnSearch(value)}
                        placeholder="Search Return"
                        allowClear
                        variant="filled"
                        className={styles.search}
                    />
                </div>
                {filteredReturns && filteredReturns.length > 0 ? (
                    <Slider {...sliderSettings} className={styles.slider}>
                        {filteredReturns.map(returnItem => (
                            <div className={styles.order_list} key={returnItem.id}>
                                <div className={styles.order_item}>
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
                                            <div className={styles.other_info}>
                                                <div className={styles.promocode_status}>
                                                    <span>Currency:</span> <strong>{returnItem.cryptoCurrency}</strong>
                                                </div>
                                                <div className={styles.promocode_status}>
                                                    <span>Amount:</span> <strong>{returnItem.refundAmount}</strong>
                                                </div>
                                                <div className={styles.promocode_status}>
                                                    <span>Hash:</span> <strong>{returnItem.cryptoTransactionHash}</strong>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.mini_status_return}>
                                            {returnItem.status === 'pending' && (
                                                <div className={styles.approved}><FcClock style={{ color: 'black' }} /><p>The refund request is being reviewed</p></div>
                                            )}
                                            {returnItem.status === 'approved' && (
                                                <div className={styles.approved}><FcOk /><p>Refund confirmed</p></div>
                                            )}
                                            {returnItem.status === 'rejected' && (
                                                <div className={styles.approved}><FcCancel /><p>Refund denied</p></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <p>У вас нет возвратов с указанным ID.</p>
                )}
            </div>
            )}

            
            {/* Раздел запросов на обмен */}
            {hasExchanges && (
            <div className={styles.exchanges}>
                <div className={styles.order_top}>
                    <h5>Exchanges</h5>
                    <AutoComplete
                        options={exchangeOptions}
                        onSelect={value => setExchangeSearch(value)}
                        onSearch={value => setExchangeSearch(value)}
                        placeholder="Search Exchange"
                        allowClear
                        variant="filled"
                        className={styles.search}
                    />
                </div>
                {filteredExchanges && filteredExchanges.length > 0 ? (
                    <Slider {...sliderSettings} className={styles.slider}>
                        {filteredExchanges.map(exchange => (
                            <div className={styles.order_list} key={exchange.id}>
                                <div className={styles.exchange_item}>
                                    <div className={styles.exchange_status}>
                                        <span>Exchange №{exchange.id}</span>
                                    </div>
                                    <div className={styles.exchange_details}>
                                        <div className={styles.old_new}>
                                            <div className={styles.old_new_names}>
                                                <div><strong>Swapped:</strong></div> {exchange.OldThing.name} - ${exchange.OldThing.price}
                                            </div>
                                            <div className={styles.old_new_names}>
                                                <div><strong>For:</strong></div> {exchange.NewThing.name} - ${exchange.NewThing.price}
                                            </div>
                                            <div className={styles.other_info}>
                                                <div className={styles.promocode_status}>
                                                    <span>Currency:</span> <strong>{exchange.cryptoCurrency}</strong>
                                                </div>
                                                <div className={styles.promocode_status}>
                                                    <span>Amount:</span> <strong>{exchange.cryptoPaymentAmount}</strong>
                                                </div>
                                                <div className={styles.promocode_status}>
                                                    <span>Hash:</span> <strong>{exchange.cryptoTransactionHash}</strong>
                                                </div>
                                            </div>
                                            <div className={styles.total_price}>
                                                <strong>Price Difference:</strong> ${exchange.priceDifference}
                                            </div>
                                        </div>

                                        
                                        <div className={styles.mini_status}>

                                            {exchange.status === 'pending' && (
                                                <div className={styles.approved}><FcClock style={{ color: 'black' }} /><p>Your exchange request is being processed</p></div>
                                            )}
                                            {exchange.status === 'approved' && (
                                                <div className={styles.approved}><FcOk /><p>Exchange approved</p></div>
                                            )}
                                            {exchange.status === 'rejected' && (
                                                <div className={styles.approved}><FcCancel /><p>Exchange denied</p></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <p>У вас нет запросов на обмен с указанным ID.</p>
                )}
            </div>
            )}

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
