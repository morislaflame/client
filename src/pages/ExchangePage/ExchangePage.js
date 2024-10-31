import React, { useContext, useEffect, useState, Suspense } from 'react'; // Добавлен Suspense
import axios from 'axios'; // Импортируем axios
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import ThingListForExchange from '../../components/ThingListForExchange/ThingListForExchange';
import { fetchOneThing } from '../../http/thingAPI'; // Удален fetchThings
import { Button, Offcanvas } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ExchangePage.module.css';
import { message, Select, Input, Skeleton } from 'antd'; // Импортируем необходимые компоненты, включая Skeleton
import { ExchangeOffcanvas, ExchangeOffcanvasBody, ExchangeOffcanvasHeader } from '../../components/StyledComponents';
import { PAYMENT_ROUTE } from '../../utils/consts';
import BackButton from '../../components/BackButton/BackButton';
import Pages from '../../components/Pages';
import FaqAccordion from '../../components/FaqAccordion/FaqAccordion';
import useCryptoRates from '../../hooks/useCryptoRates'; // Импортируем хук
import { wallets } from '../../utils/cryptoWallets'; // Импортируем wallets
import { LuArrowRightLeft } from "react-icons/lu";
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const SideBar = React.lazy(() => import('../../components/SideBar/SideBar')); // Ленивая загрузка SideBar

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

    const [isSubmitting, setIsSubmitting] = useState(false); // Добавлено состояние для анимации загрузки

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
        if (selectedThingId) {
            // Загружаем информацию о выбранном товаре
            fetchOneThing(selectedThingId).then(data => {
                setSelectedThing(data);
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
                  }
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

        setIsSubmitting(true); // Устанавливаем состояние загрузки в true

        const priceDifference = selectedThing.price - currentThing.price;

        try {
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

                await exchange.createNewExchangeRequest({
                    oldThingId: thingId,
                    newThingId: selectedThingId,
                    userComment,
                    cryptoCurrency: wallets[cryptoCurrency].currency,
                    cryptoWalletAddress,
                    cryptoPaymentAmount: cryptoPayment,
                });
                message.success('Exchange request successfully sent');
                exchange.loadUserExchangeRequests();
                navigate('/account');
            } else {
                // Товары имеют одинаковую цену
                setCryptoCurrency(Object.keys(wallets)[0] || 'usdt');
                setCryptoWalletAddress('');
                setCryptoPaymentAmount(0);

                await exchange.createNewExchangeRequest({
                    oldThingId: thingId,
                    newThingId: selectedThingId,
                    userComment,
                    cryptoCurrency: wallets[cryptoCurrency].currency,
                    cryptoWalletAddress: '',
                    cryptoPaymentAmount: 0,
                });
                message.success('Exchange request successfully sent');
                exchange.loadUserExchangeRequests();
                navigate('/account');
            }
        } catch (e) {
            console.error('Error when creating an exchange request:', e);
            message.error('Error when creating an exchange request');
        } finally {
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
              }
            setIsSubmitting(false); // Устанавливаем состояние загрузки в false после завершения
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

    const renderOffcanvasContent = () => {
        if (!selectedThing || !currentThing) return null;

        const priceDifference = selectedThing.price - currentThing.price;

        return (
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
                <div className={styles.models}>
                    <div className={styles.thing_info}>
                        <h6>Swap:</h6>
                        <span>{currentThing.name} - ${currentThing.price}</span>
                    </div>
                    <LuArrowRightLeft />
                    <div className={styles.thing_info}>
                        <h6>For:</h6>
                        <span>{selectedThing.name} - ${selectedThing.price}</span>
                    </div>
                </div>
                <span style={{fontSize: 'calc(var(--index) * 1.4)', fontWeight: '500', margin: 'calc(var(--index) * 0.5) 0'}}>Price difference: ${Math.abs(priceDifference)}</span>

                {priceDifference > 0 && (
                    <div className={styles.payment_info}>
                        <p>You need to pay an additional ${priceDifference}.</p>
                    </div>
                )}

                {priceDifference < 0 && (
                    <div className={styles.refund_info}>
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
                            <span>Price difference: ${Math.abs(priceDifference)}</span>
                            <b>{convertAmountForCrypto(wallets[cryptoCurrency].currency, Math.abs(priceDifference))} {wallets[cryptoCurrency].currency}</b>
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
                    </div>
                )}

                {priceDifference === 0 && (
                    <div className={styles.equal_price_info}>
                        <p>The exchange is even. No additional payment or refund is required.</p>
                       
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
                            fontSize: 'calc(var(--index) * 1.4)',
                        }}
                        className={styles.button}
                        disabled={isSubmitting} // Блокируем кнопку при загрузке
                    >
                        {isSubmitting ? <Spin indicator={<LoadingOutlined style={{color: 'white'}} spin />}/> : 
                        (selectedThing && currentThing && selectedThing.price - currentThing.price > 0
                            ? 'Proceed to Payment'
                            : 'Send an exchange request')}
                    </Button>
            </div>
            
        );
    };

    return (
        <div className={styles.exchange_page}>
            <div className={styles.topic_back}><BackButton/><h2>Exchange</h2></div>
            <div className={styles.shop_top}>
                <div className={styles.filters}>
                    <Suspense fallback={<Skeleton active />}>
                        <SideBar />
                    </Suspense>
                </div>
            </div>
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
                    {renderOffcanvasContent()}
                </ExchangeOffcanvasBody>
            </ExchangeOffcanvas>
        </div>
    );
});

export default ExchangePage;
