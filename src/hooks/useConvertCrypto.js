import { useCallback } from 'react';

const useCryptoConversion = (cryptoRates) => {
  const convertAmountForCrypto = useCallback((crypto, amountUSD) => {
    const rate = cryptoRates[crypto];
    if (!rate) return "Loading...";
    return (amountUSD / rate).toFixed(6);
  }, [cryptoRates]);

  return { convertAmountForCrypto };
};

export default useCryptoConversion;