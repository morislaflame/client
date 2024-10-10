import { $authHost } from "./index";

export const createExchangeRequest = async (exchangeData) => {
    const { data } = await $authHost.post('api/exchange', exchangeData);
    return data;
};

export const fetchAllExchangeRequests = async (status) => {
    const { data } = await $authHost.get('api/exchange', { params: { status } });
    return data;
};

export const fetchUserExchangeRequests = async () => {
    const { data } = await $authHost.get('api/exchange/my-requests');
    return data;
};

export const approveExchangeRequest = async (exchangeRequestId) => {
    const { data } = await $authHost.patch(`api/exchange/approve/${exchangeRequestId}`);
    return data;
};

export const rejectExchangeRequest = async (exchangeRequestId) => {
    const { data } = await $authHost.patch(`api/exchange/reject/${exchangeRequestId}`);
    return data;
};

export const confirmPayment = async (exchangeRequestId) => {
    const { data } = await $authHost.patch(`api/exchange/confirm-payment/${exchangeRequestId}`);
    return data;
};

export const confirmRefund = async (exchangeRequestId, cryptoTransactionHash) => {
    const { data } = await $authHost.patch(`api/exchange/confirm-refund/${exchangeRequestId}`, { cryptoTransactionHash });
    return data;
  };
  
