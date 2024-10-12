import { SiTether, SiBitcoinsv, SiEthereum, SiLitecoin } from "react-icons/si";

export const wallets = {
    usdt: {
        address: "0x5541a5FD4Cc660F356601DBeCdD2be3e19548095",
        currency: "USDT",
        icon: <SiTether />,
    },
    bitcoin: {
        address: "bc1q0jh3phrlml2y3uszj38w33jmrhefydk36ekvv0",
        currency: "BTC",
        icon: <SiBitcoinsv />,
    },
    ethereum: {
        address: "0x5541a5FD4Cc660F356601DBeCdD2be3e19548095",
        currency: "ETH",
        icon: <SiEthereum />,
    },
    litecoin: {
        address: "ltc1qe6jl3ah8ar586rzjv7lj4aypssx4j6wlscxj2s",
        currency: "LTC",
        icon: <SiLitecoin />,
    },
};