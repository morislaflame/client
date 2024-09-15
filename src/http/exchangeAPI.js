import { $authHost } from "./index";

// Создание запроса на обмен
export const createExchangeRequest = async (orderThingId, newThingId, userComment) => {
    const { data } = await $authHost.post('api/exchange', { orderThingId, newThingId, userComment });
    return data;
};

// Получение всех запросов пользователя на обмен
export const fetchUserExchangeRequests = async () => {
    const { data } = await $authHost.get('api/exchange/my-requests');
    return data;
};

// Получение всех запросов на обмен (для администратора)
export const fetchAllExchangeRequests = async () => {
    const { data } = await $authHost.get('api/exchange');
    return data;
};

// Подтверждение запроса на обмен
export const approveExchangeRequest = async (exchangeRequestId) => {
    const { data } = await $authHost.put(`api/exchange/approve/${exchangeRequestId}`);
    return data;
};

// Отклонение запроса на обмен
export const rejectExchangeRequest = async (exchangeRequestId) => {
    const { data } = await $authHost.put(`api/exchange/reject/${exchangeRequestId}`);
    return data;
};

// Подтверждение доплаты (для администратора)
export const confirmPayment = async (exchangeRequestId) => {
    const { data } = await $authHost.put(`api/exchange/confirm-payment/${exchangeRequestId}`);
    return data;
};

// Подтверждение возврата разницы в цене (для администратора)
export const confirmRefund = async (exchangeRequestId) => {
    const { data } = await $authHost.put(`api/exchange/confirm-refund/${exchangeRequestId}`);
    return data;
};
