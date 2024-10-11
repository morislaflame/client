// src/pages/ExchangePage/ExchangePage.js

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'; // Импортируем axios
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import ThingListForExchange from '../../components/ThingListForExchange/ThingListForExchange';
import { fetchThings, fetchOneThing } from '../../http/thingAPI';
import { Button, Offcanvas } from 'react-bootstrap';
import { createExchangeRequest } from '../../http/exchangeAPI';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ExchangePage.module.css';
import { message, Select, Input } from 'antd'; // Импортируем необходимые компоненты
import { ExchangeOffcanvas, ExchangeOffcanvasBody, ExchangeOffcanvasHeader } from '../../components/StyledComponents';
import { PAYMENT_ROUTE } from '../../utils/consts';
import BackButton from '../../components/BackButton/BackButton';
import Pages from '../../components/Pages';
import FaqAccordion from '../../components/FaqAccordion/FaqAccordion';
import { SiTether, SiBitcoinsv, SiEthereum, SiLitecoin } from "react-icons/si";

const ExchangePage = observer(() => {
    const { thing, user } = useContext(Context);
    const [selectedThingId, setSelectedThingId] = useState(null);
    const [userComment, setUserComment] = useState('');
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const navigate = useNavigate();
    const { thingId } = useParams(); // ID товара, который пользователь хочет обменять

    const [currentThing, setCurrentThing] = useState(null); // Текущий товар пользователя
    const [selectedThing, setSelectedThing] = useState(null); // Выбранный для обмена товар

    // Новые состояния для криптовалюты и адреса кошелька
    const [cryptoCurrency, setCryptoCurrency] = useState('usdt');
    const [cryptoWalletAddress, setCryptoWalletAddress] = useState('');

    // Объект wallets
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

    // Состояние для курсов криптовалют
    const [cryptoRates, setCryptoRates] = useState({
        BTC: null,
        ETH: null,
        LTC: null,
        USDT: 1, 
    });

    // Функция для получения курсов криптовалют
    const fetchCryptoRates = async () => {
        try {
            const response = await axios.get(
                "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin,tether&vs_currencies=usd"
            );
            setCryptoRates({
                BTC: response.data.bitcoin.usd,
                ETH: response.data.ethereum.usd,
                LTC: response.data.litecoin.usd,
                USDT: response.data.tether.usd,
            });
        } catch (error) {
            console.error("Ошибка получения курсов криптовалют:", error);
        }
    };

    useEffect(() => {
        fetchThings(null, null, 1, 20).then(data => {
            thing.setThings(data.rows);
        });

        // Загружаем текущий товар пользователя
        fetchOneThing(thingId).then(data => {
            setCurrentThing(data);
        });
    }, [thingId]);

    useEffect(() => {
        // Передаем параметры minPrice и maxPrice из стора
        const { min, max } = thing.priceRange;
        fetchThings(thing.selectedType.id, thing.selectedBrands, thing.page, 20, min, max).then(data => {
            thing.setThings(data.rows);
            thing.setTotalCount(data.count);
        });
    }, [thing.page, thing.selectedType, thing.selectedBrands, thing.priceRange]);

    // Отслеживаем изменение выбранного товара и управляем отображением Offcanvas
    useEffect(() => {
        if (selectedThingId) {
            // Загружаем информацию о выбранном товаре
            fetchOneThing(selectedThingId).then(data => {
                setSelectedThing(data);
                setShowOffcanvas(true);
            });
        } else {
            setSelectedThing(null);
            setShowOffcanvas(false);
        }
    }, [selectedThingId]);

    // Получаем курсы криптовалют, когда требуется возврат средств
    useEffect(() => {
        if (showOffcanvas && selectedThing && currentThing && selectedThing.price - currentThing.price < 0) {
            fetchCryptoRates();
        }
    }, [showOffcanvas, selectedThing, currentThing]);

    // Функция для конвертации суммы в выбранную криптовалюту
    const convertAmountForCrypto = (crypto, amountUSD) => {
        const rate = cryptoRates[crypto];
        if (!rate) return "Loading...";
        return (amountUSD / rate).toFixed(6); // Считаем сумму в криптовалюте
    };

    const handleSubmitExchange = async () => {
        if (!selectedThingId) {
            message.warning('Select a model to exchange');
            return;
        }

        if (!currentThing || !selectedThing) {
            message.error('Error loading item information');
            return;
        }

        const priceDifference = selectedThing.price - currentThing.price;

        if (priceDifference > 0) {
            // Требуется доплата, перенаправляем на PaymentPage
            navigate(PAYMENT_ROUTE, {
                state: {
                    exchange: true,
                    thingId,
                    selectedThingId,
                    userComment,
                    priceDifference,
                },
            });
        } else {
            // Доплата не требуется или пользователь ожидает возврат средств
            if (!cryptoWalletAddress) {
                message.warning('Please enter your wallet address');
                return;
            }

            const refundAmountUSD = Math.abs(priceDifference);
            const cryptoPaymentAmount = parseFloat(convertAmountForCrypto(wallets[cryptoCurrency].currency, refundAmountUSD));

            try {
                await createExchangeRequest({
                    oldThingId: thingId,
                    newThingId: selectedThingId,
                    userComment,
                    cryptoCurrency: wallets[cryptoCurrency].currency,
                    cryptoWalletAddress,
                    cryptoPaymentAmount, // Передаем сумму в выбранной криптовалюте
                });
                message.success('Exchange request successfully sent');
                await user.loadUserInfo(); // Заново загружаем информацию о пользователе
                navigate('/account'); // Перенаправляем на страницу аккаунта пользователя
            } catch (e) {
                console.error('Error when creating an exchange request:', e);
                message.error('Error when creating an exchange request');
            }
        }
    };

    const handleCloseOffcanvas = () => {
        setShowOffcanvas(false);
        setSelectedThingId(null);
        setUserComment('');
        setCryptoCurrency('usdt');
        setCryptoWalletAddress('');
    };

    return (
        <div className={styles.exchange_page}>
            <div className={styles.topic_back}><BackButton/><h2>Exchange</h2></div>
            <div className={styles.mainlist}>
                <ThingListForExchange selectedThingId={selectedThingId} onSelectThing={setSelectedThingId} />
                <Pages/>
            </div>
            <FaqAccordion/>

            <ExchangeOffcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} placement="bottom">
                <ExchangeOffcanvasHeader>
                    <Offcanvas.Title>Confirm exchange request</Offcanvas.Title>
                </ExchangeOffcanvasHeader>
                <ExchangeOffcanvasBody>
                    <div className={styles.selection}>
                        <div>
                            <p>Describe the reason</p>
                        </div>
                        <textarea
                            placeholder="Comment"
                            value={userComment}
                            onChange={(e) => setUserComment(e.target.value)}
                            style={{ width: '100%', minHeight: '100px', marginBottom: '20px' }}
                        />
                    </div>

                    {selectedThing && currentThing && selectedThing.price - currentThing.price < 0 && (
                        // Если требуется возврат средств, показываем дополнительные поля
                        <div className={styles.refund_details}>
                            <h5>
                                You will receive a refund of ${Math.abs(selectedThing.price - currentThing.price)} (
                                {convertAmountForCrypto(wallets[cryptoCurrency].currency, Math.abs(selectedThing.price - currentThing.price))} {wallets[cryptoCurrency].currency}
                                )
                            </h5>
                            <div className={styles.selector_pay}>
                                <label htmlFor="cryptoSelect">Choose a cryptocurrency for refund:</label>
                                <Select
                                    id="cryptoSelect"
                                    value={cryptoCurrency}
                                    onChange={(value) => setCryptoCurrency(value)}
                                    placeholder="Select"
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
                    )}

                    <Button
                        variant="dark"
                        onClick={handleSubmitExchange}
                        style={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '7px',
                        }}
                        className={styles.button}
                    >
                        {selectedThing && currentThing && selectedThing.price - currentThing.price > 0
                            ? 'Proceed to Payment'
                            : 'Send an exchange request'}
                    </Button>
                </ExchangeOffcanvasBody>
            </ExchangeOffcanvas>
        </div>
    );
});

export default ExchangePage;
