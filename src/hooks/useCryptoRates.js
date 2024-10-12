import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useCryptoRates = () => {
    const [cryptoRates, setCryptoRates] = useState({
        BTC: null,
        ETH: null,
        LTC: null,
        USDT: 1, 
    });

    const fetchCryptoRates = useCallback(async () => {
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
    }, []); // Пустой массив зависимостей означает, что функция не изменится

    useEffect(() => {
        fetchCryptoRates();
    }, [fetchCryptoRates]);

    return { cryptoRates, fetchCryptoRates };
};

export default useCryptoRates;