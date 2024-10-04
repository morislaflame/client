// exchangeAPI.js

import { $authHost } from "./index";

export const createExchangeRequest = async (exchangeData) => {
    const { data } = await $authHost.post('api/exchange', exchangeData);
    return data;
};


// Получение всех запросов на обмен (для администраторов)
export const fetchAllExchangeRequests = async (status) => {
    const { data } = await $authHost.get('api/exchange', { params: { status } });
    return data;
};

// Получение запросов на обмен текущего пользователя
export const fetchUserExchangeRequests = async () => {
    const { data } = await $authHost.get('api/exchange/my-requests');
    return data;
};

// Подтверждение запроса на обмен
export const approveExchangeRequest = async (exchangeRequestId) => {
    const { data } = await $authHost.patch(`api/exchange/approve/${exchangeRequestId}`);
    return data;
};

// Отклонение запроса на обмен
export const rejectExchangeRequest = async (exchangeRequestId) => {
    const { data } = await $authHost.patch(`api/exchange/reject/${exchangeRequestId}`);
    return data;
};

// Подтверждение доплаты
export const confirmPayment = async (exchangeRequestId) => {
    const { data } = await $authHost.patch(`api/exchange/confirm-payment/${exchangeRequestId}`);
    return data;
};


export const confirmRefund = async (exchangeRequestId, cryptoTransactionHash) => {
    const { data } = await $authHost.patch(`api/exchange/confirm-refund/${exchangeRequestId}`, { cryptoTransactionHash });
    return data;
  };
  
