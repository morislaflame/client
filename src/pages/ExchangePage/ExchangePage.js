import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'; // Импортируем axios
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import ThingListForExchange from '../../components/ThingListForExchange/ThingListForExchange';
import { fetchThings, fetchOneThing } from '../../http/thingAPI';
import { Button, Offcanvas } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ExchangePage.module.css';
import { message, Select, Input } from 'antd'; // Импортируем необходимые компоненты
import { ExchangeOffcanvas, ExchangeOffcanvasBody, ExchangeOffcanvasHeader } from '../../components/StyledComponents';
import { PAYMENT_ROUTE } from '../../utils/consts';
import BackButton from '../../components/BackButton/BackButton';
import Pages from '../../components/Pages';
import FaqAccordion from '../../components/FaqAccordion/FaqAccordion';
import useCryptoRates from '../../hooks/useCryptoRates'; // Импортируем хук
import { wallets } from '../../utils/cryptoWallets'; // Импортируем wallets

const ExchangePage = observer(() => {
    const { thing, user, exchange } = useContext(Context); // Используем exchange из контекста
    const [selectedThingId, setSelectedThingId] = useState(null);
    const [userComment, setUserComment] = useState('');
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const navigate = useNavigate();
    const { thingId } = useParams(); // ID товара, который пользователь хочет обменять

    const [currentThing, setCurrentThing] = useState(null); // Текущий товар пользователя
    const [selectedThing, setSelectedThing] = useState(null); // Выбранный для обмена товар

    // Новые состояния для криптовалюты и адреса кошелька
    const [cryptoCurrency, setCryptoCurrency] = useState(Object.keys(wallets)[0] || 'usdt');
    const [cryptoWalletAddress, setCryptoWalletAddress] = useState('');
    const [cryptoPaymentAmount, setCryptoPaymentAmount] = useState(0);

    // Используем хук для получения курсов криптовалют
    const { cryptoRates, fetchCryptoRates } = useCryptoRates();

    useEffect(() => {
        const savedPage = sessionStorage.getItem('exchangeCurrentPage');
        if (savedPage) {
            thing.setPage(Number(savedPage));
        }

        fetchOneThing(thingId).then(data => {
            setCurrentThing(data);
        });

        exchange.loadUserExchangeRequests(); // Загрузка запросов на обмен пользователя
    }, [thingId, thing, exchange]);

    useEffect(() => {
        // Передаем параметры minPrice и maxPrice из стора
        const { min, max } = thing.priceRange;
        fetchThings(thing.selectedType.id, thing.selectedBrands, thing.page, 20, min, max).then(data => {
            thing.setThings(data.rows);
            thing.setTotalCount(data.count);
        });
        sessionStorage.setItem('exchangeCurrentPage', thing.page);
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
        if (showOffcanvas && selectedThing && currentThing) {
            const priceDiff = selectedThing.price - currentThing.price;
            if (priceDiff < 0) {
                fetchCryptoRates();
            }
        }
    }, [showOffcanvas, selectedThing, currentThing, fetchCryptoRates]);

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
            message.error('Error loading model information');
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
        } else if (priceDifference < 0) {
            // Требуется возврат средств
            if (!cryptoWalletAddress) {
                message.warning('Please enter your wallet address');
                return;
            }

            const refundAmountUSD = Math.abs(priceDifference);
            const cryptoPayment = parseFloat(convertAmountForCrypto(wallets[cryptoCurrency].currency, refundAmountUSD));

            try {
                await exchange.createNewExchangeRequest({
                    oldThingId: thingId,
                    newThingId: selectedThingId,
                    userComment,
                    cryptoCurrency: wallets[cryptoCurrency].currency,
                    cryptoWalletAddress,
                    cryptoPaymentAmount: cryptoPayment, // Передаем сумму в выбранной криптовалюте
                });
                message.success('Exchange request successfully sent');
                exchange.loadUserExchangeRequests(); // Заново загружаем запросы на обмен
                navigate('/account'); // Перенаправляем на страницу аккаунта пользователя
            } catch (e) {
                console.error('Error when creating an exchange request:', e);
                message.error('Error when creating an exchange request');
            }
        } else {
            // Товары имеют одинаковую цену
            setCryptoCurrency(Object.keys(wallets)[0] || 'usdt');
            setCryptoWalletAddress('');
            setCryptoPaymentAmount(0);

            try {
                await exchange.createNewExchangeRequest({
                    oldThingId: thingId,
                    newThingId: selectedThingId,
                    userComment,
                    cryptoCurrency: wallets[cryptoCurrency].currency,
                    cryptoWalletAddress: '',
                    cryptoPaymentAmount: 0,
                });
                message.success('Exchange request successfully sent');
                exchange.loadUserExchangeRequests(); // Заново загружаем запросы на обмен
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
        setCryptoCurrency(Object.keys(wallets)[0] || 'usdt');
        setCryptoWalletAddress('');
        setCryptoPaymentAmount(0);
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
                            <span>Describe the reason</span>
                        </div>
                        <textarea
                            placeholder="Comment"
                            value={userComment}
                            onChange={(e) => setUserComment(e.target.value)}
                            style={{ width: '100%', minHeight: '80px', fontSize: 'calc(var(--index) * 1.4)'}}
                        />
                        {selectedThing && currentThing && selectedThing.price - currentThing.price < 0 && (
                        // Если требуется возврат средств, показываем дополнительные поля
                        <>
                            <div className={styles.selector_pay}>
                                <label htmlFor="cryptoSelect">Cryptocurrency for refund:</label>
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
                            <div className={styles.crypto_amount}>
                                <span>Price difference: ${Math.abs(selectedThing.price - currentThing.price)}</span>
                                <b>{convertAmountForCrypto(wallets[cryptoCurrency].currency, Math.abs(selectedThing.price - currentThing.price))} {wallets[cryptoCurrency].currency}</b>
                            </div>
                            <div className={styles.wallet_input}>
                                <label htmlFor="walletAddress">Wallet:</label>
                                <Input
                                    id="walletAddress"
                                    value={cryptoWalletAddress}
                                    onChange={(e) => setCryptoWalletAddress(e.target.value)}
                                    placeholder="Wallet address"
                                />
                            </div>
                        </>
                        )}
                    </div>

                    <Button
                        variant="dark"
                        onClick={handleSubmitExchange}
                        style={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '7px',
                            fontSize: 'calc(var(--index) * 1.4)',
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